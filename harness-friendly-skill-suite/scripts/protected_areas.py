import argparse
import json
from pathlib import Path
from typing import Dict, List

PROTECTED_FILE_NAMES = {
    'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'tsconfig.json',
    'vite.config.ts', 'vite.config.js', 'webpack.config.js', 'next.config.js', 'next.config.mjs',
    'docker-compose.yml', 'dockerfile', '.env', '.env.local', '.gitignore'
}
SOURCE_SUFFIXES = {'.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.go', '.rs', '.c', '.cpp', '.cs', '.rb', '.php'}
CONFIG_SUFFIXES = {'.toml', '.ini', '.cfg', '.conf', '.lock'}
PROTECTED_DIRS = {'.git', '.next', 'node_modules', 'dist', 'build', 'coverage', '.venv', 'venv'}
SAFE_DOC_ROOTS = {'docs', 'templates', 'reports', 'examples', 'plugins', 'skills'}


def classify(rel: Path) -> Dict:
    name = rel.name
    suffix = rel.suffix.lower()
    first = rel.parts[0] if rel.parts else ''

    if any(part in PROTECTED_DIRS for part in rel.parts):
        return {'path': str(rel), 'bucket': 'protected', 'reason': 'generated/build/vendor directory'}
    if name in PROTECTED_FILE_NAMES:
        return {'path': str(rel), 'bucket': 'protected', 'reason': 'well-known runtime/build/config file'}
    if first == '.harness':
        return {'path': str(rel), 'bucket': 'protected', 'reason': 'canonical runtime state/artifact area'}
    if first == '.omx':
        return {'path': str(rel), 'bucket': 'protected', 'reason': 'historical planning/session artifact area'}
    if suffix in SOURCE_SUFFIXES:
        return {'path': str(rel), 'bucket': 'approval-required', 'reason': 'source file may be runtime/import coupled'}
    if suffix in CONFIG_SUFFIXES:
        return {'path': str(rel), 'bucket': 'approval-required', 'reason': 'config file may affect runtime behavior'}
    if first in SAFE_DOC_ROOTS or suffix in {'.md', '.txt', '.rst', '.adoc'}:
        return {'path': str(rel), 'bucket': 'safe', 'reason': 'documentation/metadata oriented file'}
    return {'path': str(rel), 'bucket': 'approval-required', 'reason': 'unclear coupling; review before changes'}


def build(repo_root: Path) -> Dict:
    items: List[Dict] = []
    counts = {'protected': 0, 'approval-required': 0, 'safe': 0}
    for path in sorted(repo_root.rglob('*')):
        if not path.is_file():
            continue
        rel = path.relative_to(repo_root)
        info = classify(rel)
        items.append(info)
        counts[info['bucket']] += 1
    return {
        'repo': str(repo_root),
        'summary': counts,
        'items': items,
    }


def render_markdown(data: Dict, output_path: Path) -> None:
    lines = [
        '# Protected Areas',
        '',
        '## Summary',
        f"- Protected: {data['summary']['protected']}",
        f"- Approval-required: {data['summary']['approval-required']}",
        f"- Safe: {data['summary']['safe']}",
        '',
    ]
    for bucket in ['protected', 'approval-required', 'safe']:
        lines.append(f'## {bucket.title()}')
        bucket_items = [item for item in data['items'] if item['bucket'] == bucket]
        if bucket_items:
            for item in bucket_items:
                lines.append(f"- `{item['path']}` — {item['reason']}")
        else:
            lines.append('- none')
        lines.append('')
    output_path.write_text('\n'.join(lines), encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser(description='Classify protected areas for harness-safe adaptation.')
    parser.add_argument('--repo', default='.', help='Repository root')
    parser.add_argument('--json-out', default='.harness/artifacts/protected-areas.json')
    parser.add_argument('--md-out', default='.harness/artifacts/protected-areas.md')
    args = parser.parse_args()

    repo_root = Path(args.repo).resolve()
    data = build(repo_root)
    json_path = Path(args.json_out)
    md_path = Path(args.md_out)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    render_markdown(data, md_path)
    print(f'Wrote {json_path}')
    print(f'Wrote {md_path}')


if __name__ == '__main__':
    main()
