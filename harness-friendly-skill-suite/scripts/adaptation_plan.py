import argparse
import json
from pathlib import Path
from typing import Dict, List


def load_json(path: Path) -> Dict:
    return json.loads(path.read_text(encoding='utf-8-sig'))


def build_plan(repo_root: Path) -> Dict:
    inventory = load_json(repo_root / '.harness' / 'artifacts' / 'repo-inventory.json')
    protected = load_json(repo_root / '.harness' / 'artifacts' / 'protected-areas.json')
    rename_plan = load_json(repo_root / '.harness' / 'artifacts' / 'rename-plan.json')

    safe_docs = [item['path'] for item in protected['items'] if item['bucket'] == 'safe']
    approval_items = [item['path'] for item in protected['items'] if item['bucket'] == 'approval-required']
    protected_items = [item['path'] for item in protected['items'] if item['bucket'] == 'protected']
    safe_renames = [c for c in rename_plan['candidates'] if c['risk'] == 'safe' and c['proposed_path']]

    low_risk_changes: List[str] = []
    if 'AGENTS.md' in safe_docs:
        low_risk_changes.append('Maintain `AGENTS.md` as the explicit agent entrypoint and keep it synchronized with README/runbook changes.')
    if any(p.startswith('docs\\') or p.startswith('docs/') for p in safe_docs):
        low_risk_changes.append('Evolve documentation and navigation files before touching any runtime-coupled source files.')
    if any(p.startswith('reports\\') or p.startswith('reports/') for p in safe_docs):
        low_risk_changes.append('Preserve `reports/` as the human-facing mirror of canonical `.harness/artifacts/` outputs.')
    if not low_risk_changes:
        low_risk_changes.append('No obvious low-risk doc-only changes were inferred beyond maintaining current structure.')

    return {
        'repo': str(repo_root),
        'summary': {
            'total_files_seen': inventory['summary']['total_files'],
            'safe_items': len(safe_docs),
            'protected_items': len(protected_items),
            'approval_required_items': len(approval_items),
            'safe_rename_candidates': len(safe_renames),
        },
        'inventory_entrypoints': inventory['summary']['important_entrypoints'],
        'protected_areas': protected_items,
        'approval_required': approval_items,
        'low_risk_changes': low_risk_changes,
        'rename_candidates': safe_renames,
        'stop_conditions': [
            'Do not modify core product/runtime logic without explicit approval.',
            'Stop if a rename affects imports, config, routing, build, deployment, or external contracts.',
            'Stop if a proposed change targets `.harness/` or `.omx/` runtime/history areas directly.',
        ],
    }


def render_markdown(plan: Dict, output_path: Path) -> None:
    lines = [
        '# Adaptation Plan',
        '',
        '## Summary',
        f"- Total files seen: {plan['summary']['total_files_seen']}",
        f"- Safe items: {plan['summary']['safe_items']}",
        f"- Protected items: {plan['summary']['protected_items']}",
        f"- Approval-required items: {plan['summary']['approval_required_items']}",
        f"- Safe rename candidates: {plan['summary']['safe_rename_candidates']}",
        '',
        '## Important entrypoints',
    ]
    for item in plan['inventory_entrypoints']:
        lines.append(f'- `{item}`')
    lines += ['', '## Low-risk changes to prioritize']
    for item in plan['low_risk_changes']:
        lines.append(f'- {item}')
    lines += ['', '## Safe rename candidates']
    if plan['rename_candidates']:
        for item in plan['rename_candidates']:
            lines.append(f"- `{item['path']}` -> `{item['proposed_path']}`")
    else:
        lines.append('- none')
    lines += ['', '## Approval-required items']
    for item in plan['approval_required']:
        lines.append(f'- `{item}`')
    lines += ['', '## Stop conditions']
    for item in plan['stop_conditions']:
        lines.append(f'- {item}')
    output_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser(description='Generate canonical adaptation plan from prior harness artifacts.')
    parser.add_argument('--repo', default='.', help='Repository root')
    parser.add_argument('--json-out', default='.harness/artifacts/adaptation-plan.json')
    parser.add_argument('--md-out', default='.harness/artifacts/adaptation-plan.md')
    args = parser.parse_args()

    repo_root = Path(args.repo).resolve()
    plan = build_plan(repo_root)
    json_path = Path(args.json_out)
    md_path = Path(args.md_out)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    render_markdown(plan, md_path)
    print(f'Wrote {json_path}')
    print(f'Wrote {md_path}')


if __name__ == '__main__':
    main()
