import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Dict, List

TOP_CATEGORIES = {
    'docs': ['docs'],
    'skills': ['skills'],
    'scripts': ['scripts'],
    'templates': ['templates'],
    'reports': ['reports'],
    'plugins': ['plugins'],
    'examples': ['examples'],
    'runtime': ['.harness'],
}


def categorize(path: Path) -> str:
    first = path.parts[0] if path.parts else ''
    for name, roots in TOP_CATEGORIES.items():
        if first in roots:
            return name
    if first.startswith('.'):
        return 'hidden'
    return 'other'


def build_inventory(repo_root: Path) -> Dict:
    files = []
    categories = Counter()
    for path in sorted(repo_root.rglob('*')):
        if not path.is_file():
            continue
        rel = path.relative_to(repo_root)
        category = categorize(rel)
        categories[category] += 1
        files.append({
            'path': str(rel),
            'category': category,
            'suffix': path.suffix.lower(),
        })

    important = [
        p for p in ['README.md', 'AGENTS.md', 'docs/harness-suite/governance.md', 'docs/harness-suite/runbook.md',
                    'scripts/harness_loop.py', '.harness/state/loop-state.json'] if (repo_root / p).exists()
    ]

    return {
        'repo': str(repo_root),
        'summary': {
            'total_files': len(files),
            'categories': dict(categories),
            'important_entrypoints': important,
        },
        'files': files,
    }


def render_markdown(inventory: Dict, output_path: Path) -> None:
    lines = [
        '# Repo Inventory',
        '',
        '## Summary',
        f"- Total files: {inventory['summary']['total_files']}",
        '',
        '## Categories',
    ]
    for name, count in inventory['summary']['categories'].items():
        lines.append(f'- {name}: {count}')
    lines += ['', '## Important entrypoints']
    for item in inventory['summary']['important_entrypoints']:
        lines.append(f'- `{item}`')
    lines += ['', '## File listing']
    for item in inventory['files']:
        lines.append(f"- `{item['path']}` ({item['category']}, `{item['suffix'] or '[no suffix]'}`)")
    output_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser(description='Generate canonical repo inventory artifacts.')
    parser.add_argument('--repo', default='.', help='Repository root')
    parser.add_argument('--json-out', default='.harness/artifacts/repo-inventory.json')
    parser.add_argument('--md-out', default='.harness/artifacts/repo-inventory.md')
    args = parser.parse_args()

    repo_root = Path(args.repo).resolve()
    inventory = build_inventory(repo_root)
    json_path = Path(args.json_out)
    md_path = Path(args.md_out)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(inventory, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    render_markdown(inventory, md_path)
    print(f'Wrote {json_path}')
    print(f'Wrote {md_path}')


if __name__ == '__main__':
    main()
