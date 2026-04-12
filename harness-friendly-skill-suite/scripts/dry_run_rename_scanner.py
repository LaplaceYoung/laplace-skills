import argparse
import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Optional

SAFE_EXTENSIONS = {
    '.md', '.mdx', '.txt', '.rst', '.adoc', '.csv', '.tsv', '.yaml', '.yml', '.json'
}
PROTECTED_FILENAMES = {
    'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock',
    'tsconfig.json', 'vite.config.ts', 'vite.config.js', 'webpack.config.js',
    'next.config.js', 'next.config.mjs', 'nuxt.config.ts', 'tailwind.config.js',
    'dockerfile', 'docker-compose.yml', '.gitignore', '.env', '.env.local'
}
RESERVED_DOC_FILENAMES = {'README.md', 'AGENTS.md', 'SKILL.md', 'LICENSE', 'CHANGELOG.md'}
PROTECTED_DIR_NAMES = {
    '.git', '.next', 'node_modules', 'dist', 'build', 'coverage', '.venv', 'venv', '.idea', '.vscode'
}
DOCS_SAFE_DIR_MARKERS = {'docs', 'templates', 'reports', 'plugins', 'skills'}
VAGUE_TOKENS = {'misc', 'temp', 'tmp', 'new', 'draft', 'draft2', 'final', 'final2', 'notes', 'stuff'}


def kebab_case(value: str) -> str:
    value = value.strip()
    value = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', value)
    value = re.sub(r'[^A-Za-z0-9]+', '-', value)
    value = re.sub(r'-+', '-', value)
    return value.strip('-').lower()


@dataclass
class RenameCandidate:
    path: str
    proposed_path: Optional[str]
    risk: str
    reason: str
    file_type: str


def is_hidden(path: Path) -> bool:
    return any(part.startswith('.') and part not in {'.github'} for part in path.parts)


def classify_file(path: Path, repo_root: Path) -> tuple[str, str, str]:
    rel = path.relative_to(repo_root)
    suffix = path.suffix.lower()
    name = path.name
    stem = path.stem
    parent_markers = {part.lower() for part in rel.parts[:-1]}

    if any(part.lower() in PROTECTED_DIR_NAMES for part in rel.parts):
        return ('protected', 'inside protected/generated directory', 'generated')
    if name.lower() in PROTECTED_FILENAMES:
        return ('protected', 'well-known runtime/build/config file', 'config')
    if is_hidden(rel) and suffix not in {'.md', '.txt'}:
        return ('protected', 'hidden file with possible tool/runtime coupling', 'hidden')
    if suffix in {'.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.go', '.rs', '.c', '.cpp', '.cs', '.rb', '.php'}:
        return ('approval-required', 'source code file may be import/runtime coupled', 'source')
    if suffix in {'.toml', '.ini', '.cfg', '.conf', '.lock'}:
        return ('approval-required', 'configuration file may affect runtime behavior', 'config')
    if suffix not in SAFE_EXTENSIONS:
        return ('approval-required', 'unknown or binary-like file type', 'other')
    if parent_markers & DOCS_SAFE_DIR_MARKERS:
        return ('safe', 'documentation/metadata area', 'doc')
    if suffix in {'.md', '.txt', '.rst', '.adoc'}:
        return ('safe', 'documentation-like file', 'doc')
    return ('approval-required', 'safe extension but location may be coupled', 'metadata')


def propose_name(path: Path) -> Optional[str]:
    if path.name in RESERVED_DOC_FILENAMES:
        return None
    suffix = path.suffix.lower()
    stem = path.stem
    proposed_stem = kebab_case(stem)
    if not proposed_stem:
        return None
    if stem.lower() in VAGUE_TOKENS:
        proposed_stem = f'{proposed_stem}-notes' if suffix in {'.md', '.txt'} else f'{proposed_stem}-file'
    proposed = proposed_stem + suffix
    return proposed if proposed != path.name else None


def scan(repo_root: Path) -> List[RenameCandidate]:
    candidates: List[RenameCandidate] = []
    for path in sorted(repo_root.rglob('*')):
        if not path.is_file():
            continue
        if '.omx' in path.parts or '.harness' in path.parts:
            continue
        risk, reason, file_type = classify_file(path, repo_root)
        proposed_name = propose_name(path)
        proposed_path = str(path.with_name(proposed_name).relative_to(repo_root)) if proposed_name else None
        if proposed_path or risk != 'safe':
            candidates.append(RenameCandidate(
                path=str(path.relative_to(repo_root)),
                proposed_path=proposed_path,
                risk=risk,
                reason=reason,
                file_type=file_type,
            ))
    return candidates


def render_markdown(candidates: List[RenameCandidate], output_path: Path) -> None:
    safe = [c for c in candidates if c.risk == 'safe' and c.proposed_path]
    approval = [c for c in candidates if c.risk == 'approval-required']
    protected = [c for c in candidates if c.risk == 'protected']
    lines = [
        '# Dry-Run Rename Plan',
        '',
        '## Summary',
        f'- Safe rename candidates: {len(safe)}',
        f'- Approval-required files reviewed: {len(approval)}',
        f'- Protected files skipped: {len(protected)}',
        '',
        '## Safe rename candidates',
    ]
    if safe:
        for item in safe:
            lines.append(f'- `{item.path}` -> `{item.proposed_path}` ({item.reason})')
    else:
        lines.append('- none')
    lines += ['', '## Approval-required review items']
    if approval:
        for item in approval:
            proposed = f' | proposed: `{item.proposed_path}`' if item.proposed_path else ''
            lines.append(f'- `{item.path}` ({item.file_type}) — {item.reason}{proposed}')
    else:
        lines.append('- none')
    lines += ['', '## Protected/skipped']
    if protected:
        for item in protected:
            lines.append(f'- `{item.path}` — {item.reason}')
    else:
        lines.append('- none')
    output_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser(description='Create a dry-run rename plan for harness-friendly normalization.')
    parser.add_argument('--repo', default='.', help='Repository root to scan')
    parser.add_argument('--json-out', default='.harness/artifacts/rename-plan.json', help='Path to write canonical JSON results')
    parser.add_argument('--md-out', default='.harness/artifacts/rename-plan.md', help='Path to write canonical Markdown report')
    args = parser.parse_args()

    repo_root = Path(args.repo).resolve()
    candidates = scan(repo_root)

    json_path = Path(args.json_out)
    md_path = Path(args.md_out)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        'repo': str(repo_root),
        'summary': {
            'safe_rename_candidates': sum(1 for c in candidates if c.risk == 'safe' and c.proposed_path),
            'approval_required_items': sum(1 for c in candidates if c.risk == 'approval-required'),
            'protected_items': sum(1 for c in candidates if c.risk == 'protected'),
        },
        'candidates': [asdict(c) for c in candidates],
    }
    json_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    render_markdown(candidates, md_path)
    print(f'Wrote {json_path}')
    print(f'Wrote {md_path}')


if __name__ == '__main__':
    main()
