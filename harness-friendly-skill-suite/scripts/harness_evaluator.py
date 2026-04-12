import argparse
import json
from pathlib import Path
from typing import Dict, List

REQUIRED_DOCS = [
    'README.md',
    'docs/harness-suite/governance.md',
    'docs/harness-suite/runbook.md',
    'docs/harness-suite/project-map.md',
]
REQUIRED_TEMPLATES = [
    'templates/change-trace-template.md',
    'templates/protected-areas-template.md',
    'templates/repo-inventory-template.md',
    'templates/adaptation-plan-template.md',
]
REQUIRED_SKILLS = [
    'skills/harness-adapt/SKILL.md',
    'skills/harness-brownfield-audit/SKILL.md',
    'skills/harness-greenfield-scaffold/SKILL.md',
    'skills/harness-naming-normalizer/SKILL.md',
    'skills/harness-change-trace/SKILL.md',
]


def exists(repo_root: Path, rel_path: str) -> bool:
    return (repo_root / rel_path).exists()


def score_presence(repo_root: Path, paths: List[str]) -> tuple[int, int, List[str]]:
    present = [p for p in paths if exists(repo_root, p)]
    score = int(round((len(present) / len(paths)) * 100)) if paths else 100
    missing = [p for p in paths if p not in present]
    return score, len(present), missing


def count_reports(repo_root: Path) -> int:
    reports = repo_root / 'reports'
    return len(list(reports.glob('*.md'))) if reports.exists() else 0


def count_templates(repo_root: Path) -> int:
    templates = repo_root / 'templates'
    return len(list(templates.glob('*.md'))) if templates.exists() else 0


def evaluate(repo_root: Path) -> Dict:
    docs_score, docs_present, docs_missing = score_presence(repo_root, REQUIRED_DOCS)
    templates_score, templates_present, templates_missing = score_presence(repo_root, REQUIRED_TEMPLATES)
    skills_score, skills_present, skills_missing = score_presence(repo_root, REQUIRED_SKILLS)

    legibility = int(round((docs_score * 0.5) + (skills_score * 0.3) + (templates_score * 0.2)))
    safety = int(round((100 if exists(repo_root, 'docs/harness-suite/governance.md') else 0) * 0.4 +
                       (100 if exists(repo_root, 'templates/protected-areas-template.md') else 0) * 0.2 +
                       (100 if exists(repo_root, '.harness/state/loop-state.json') else 0) * 0.2 +
                       (100 if exists(repo_root, 'reports/change-trace-2026-04-12.md') else 0) * 0.2))
    traceability = min(100, 40 + count_reports(repo_root) * 20 + count_templates(repo_root) * 5)
    overall = int(round(legibility * 0.45 + safety * 0.30 + traceability * 0.25))

    return {
        'repo': str(repo_root),
        'scores': {
            'overall': overall,
            'legibility': legibility,
            'safety': safety,
            'traceability': traceability,
        },
        'checks': {
            'required_docs': {
                'present': docs_present,
                'total': len(REQUIRED_DOCS),
                'missing': docs_missing,
            },
            'required_templates': {
                'present': templates_present,
                'total': len(REQUIRED_TEMPLATES),
                'missing': templates_missing,
            },
            'required_skills': {
                'present': skills_present,
                'total': len(REQUIRED_SKILLS),
                'missing': skills_missing,
            },
            'reports_count': count_reports(repo_root),
            'templates_count': count_templates(repo_root),
        },
        'verdict': verdict(overall),
        'recommendations': recommendations(repo_root, docs_missing, templates_missing, skills_missing),
    }


def verdict(overall: int) -> str:
    if overall >= 85:
        return 'strong'
    if overall >= 70:
        return 'good'
    if overall >= 50:
        return 'partial'
    return 'weak'


def recommendations(repo_root: Path, docs_missing: List[str], templates_missing: List[str], skills_missing: List[str]) -> List[str]:
    items: List[str] = []
    if docs_missing:
        items.append('Add missing core docs to improve agent entrypoint discovery.')
    if templates_missing:
        items.append('Add missing templates so each adaptation phase leaves a structured artifact.')
    if skills_missing:
        items.append('Add missing skill specs so the harness flow stays discoverable and standardized.')
    if not (repo_root / 'scripts/dry_run_rename_scanner.py').exists():
        items.append('Add a dry-run rename scanner to standardize safe normalization planning.')
    if not (repo_root / '.harness/state/loop-state.json').exists():
        items.append('Add canonical loop state under .harness/state for resumable runs.')
    if not (repo_root / 'reports').exists():
        items.append('Add a reports directory to preserve traceable outcomes.')
    return items or ['Maintain current structure and consider adding automated before/after comparison over time.']


def render_markdown(result: Dict, output_path: Path) -> None:
    lines = [
        '# Harness Evaluator Report',
        '',
        '## Scores',
        f"- Overall: {result['scores']['overall']}",
        f"- Legibility: {result['scores']['legibility']}",
        f"- Safety: {result['scores']['safety']}",
        f"- Traceability: {result['scores']['traceability']}",
        f"- Verdict: {result['verdict']}",
        '',
        '## Checks',
        f"- Required docs: {result['checks']['required_docs']['present']} / {result['checks']['required_docs']['total']}",
        f"- Required templates: {result['checks']['required_templates']['present']} / {result['checks']['required_templates']['total']}",
        f"- Required skills: {result['checks']['required_skills']['present']} / {result['checks']['required_skills']['total']}",
        f"- Reports count: {result['checks']['reports_count']}",
        f"- Templates count: {result['checks']['templates_count']}",
        '',
        '## Missing items',
    ]
    missing = result['checks']['required_docs']['missing'] + result['checks']['required_templates']['missing'] + result['checks']['required_skills']['missing']
    if missing:
        for item in missing:
            lines.append(f'- `{item}`')
    else:
        lines.append('- none')
    lines += ['', '## Recommendations']
    for item in result['recommendations']:
        lines.append(f'- {item}')
    output_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser(description='Evaluate repo harness friendliness.')
    parser.add_argument('--repo', default='.', help='Repository root to evaluate')
    parser.add_argument('--run-id', default=None, help='Optional run id to embed in result')
    parser.add_argument('--json-out', default='.harness/artifacts/harness-evaluator.json', help='Path to write canonical JSON results')
    parser.add_argument('--md-out', default='.harness/artifacts/harness-evaluator.md', help='Path to write canonical Markdown report')
    args = parser.parse_args()

    repo_root = Path(args.repo).resolve()
    result = evaluate(repo_root)
    if args.run_id:
        result['run_id'] = args.run_id
    json_path = Path(args.json_out)
    md_path = Path(args.md_out)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    render_markdown(result, md_path)
    print(f'Wrote {json_path}')
    print(f'Wrote {md_path}')


if __name__ == '__main__':
    main()
