import argparse
import json
import shutil
from pathlib import Path
from typing import Dict, List

SAFE_ROOTS = {'docs', 'reports', 'templates', 'examples', 'plugins'}
SAFE_FILENAMES = {'README.md', 'AGENTS.md', 'SKILL.md'}


def load_json(path: Path) -> Dict:
    return json.loads(path.read_text(encoding='utf-8-sig'))


def normalize(path_str: str) -> str:
    return path_str.replace('\\', '/')


def is_safe_path(path_str: str) -> bool:
    path_str = normalize(path_str)
    parts = path_str.split('/')
    if not parts:
        return False
    if parts[-1] in SAFE_FILENAMES:
        return False
    return parts[0] in SAFE_ROOTS


def gather_actions(repo_root: Path) -> List[Dict]:
    rename_plan = load_json(repo_root / '.harness' / 'artifacts' / 'rename-plan.json')
    actions: List[Dict] = []
    for candidate in rename_plan.get('candidates', []):
        if candidate.get('risk') != 'safe':
            continue
        src = normalize(candidate['path'])
        dst = normalize(candidate['proposed_path']) if candidate.get('proposed_path') else None
        if not dst:
            continue
        if is_safe_path(src) and is_safe_path(dst):
            actions.append({'type': 'rename', 'src': src, 'dst': dst, 'reason': 'safe rename candidate'})
    return actions


def apply_actions(repo_root: Path, actions: List[Dict]) -> List[Dict]:
    applied = []
    for action in actions:
        if action['type'] == 'rename':
            src = repo_root / action['src']
            dst = repo_root / action['dst']
            if src.exists() and not dst.exists():
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(src), str(dst))
                applied.append(action)
    return applied


def render_md(actions: List[Dict], applied: List[Dict], output: Path, apply_mode: bool) -> None:
    lines = [
        '# Low-Risk Executor Report',
        '',
        f'- Mode: {'apply' if apply_mode else 'dry-run'}',
        f'- Planned actions: {len(actions)}',
        f'- Applied actions: {len(applied)}',
        '',
        '## Actions',
    ]
    if actions:
        for a in actions:
            prefix = '[applied]' if a in applied else '[planned]'
            lines.append(f"- {prefix} rename `{a['src']}` -> `{a['dst']}`")
    else:
        lines.append('- none')
    output.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser(description='Execute only low-risk harness adaptation actions.')
    parser.add_argument('--repo', default='.')
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--json-out', default='.harness/artifacts/low-risk-executor.json')
    parser.add_argument('--md-out', default='.harness/artifacts/low-risk-executor.md')
    args = parser.parse_args()

    repo_root = Path(args.repo).resolve()
    actions = gather_actions(repo_root)
    applied = apply_actions(repo_root, actions) if args.apply else []

    payload = {
        'repo': str(repo_root),
        'mode': 'apply' if args.apply else 'dry-run',
        'planned_actions': actions,
        'applied_actions': applied,
    }
    json_path = Path(args.json_out)
    md_path = Path(args.md_out)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    render_md(actions, applied, md_path, args.apply)
    print(f'Wrote {json_path}')
    print(f'Wrote {md_path}')


if __name__ == '__main__':
    main()
