import argparse
import json
from pathlib import Path
from typing import Dict, Optional


def load_json(path: Path) -> Dict:
    return json.loads(path.read_text(encoding='utf-8-sig'))


def load_optional(path: Path) -> Optional[Dict]:
    return load_json(path) if path.exists() else None


def compare(current: Dict, previous: Dict) -> Dict:
    curr_scores = current.get('scores', {})
    prev_scores = previous.get('scores', {})
    score_delta = {k: curr_scores.get(k, 0) - prev_scores.get(k, 0) for k in set(curr_scores) | set(prev_scores)}
    return {
        'current_run': current.get('run_id'),
        'previous_run': previous.get('run_id'),
        'score_delta': score_delta,
        'verdict_changed': current.get('verdict') != previous.get('verdict'),
        'current_verdict': current.get('verdict'),
        'previous_verdict': previous.get('verdict'),
    }


def render_md(delta: Dict, out: Path) -> None:
    lines = [
        '# Delta Evaluator',
        '',
        f"- Current run: {delta.get('current_run')}",
        f"- Previous run: {delta.get('previous_run')}",
        f"- Current verdict: {delta.get('current_verdict')}",
        f"- Previous verdict: {delta.get('previous_verdict')}",
        '',
        '## Score delta',
    ]
    for k, v in delta.get('score_delta', {}).items():
        lines.append(f'- {k}: {v:+d}')
    out.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser(description='Compare current evaluator output to a previous run.')
    parser.add_argument('--repo', default='.')
    parser.add_argument('--current', default='.harness/artifacts/harness-evaluator.json')
    parser.add_argument('--previous', default=None)
    parser.add_argument('--json-out', default='.harness/artifacts/delta-evaluator.json')
    parser.add_argument('--md-out', default='.harness/artifacts/delta-evaluator.md')
    args = parser.parse_args()

    repo_root = Path(args.repo).resolve()
    current = load_json(repo_root / args.current)
    previous_path = Path(args.previous) if args.previous else None
    if previous_path is None:
        prev_art = repo_root / '.harness' / 'artifacts' / 'harness-evaluator.previous.json'
        if not prev_art.exists():
            delta = {'current_run': None, 'previous_run': None, 'score_delta': {}, 'current_verdict': current.get('verdict'), 'previous_verdict': None}
        else:
            prev_payload = load_optional(prev_art)
            delta = compare(current, prev_payload) if prev_payload else {'current_run': None, 'previous_run': None, 'score_delta': {}, 'current_verdict': current.get('verdict'), 'previous_verdict': None}
    else:
        previous = load_json((repo_root / previous_path).resolve() if not previous_path.is_absolute() else previous_path)
        delta = compare(current, previous)

    json_path = Path(args.json_out)
    md_path = Path(args.md_out)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(delta, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    render_md(delta, md_path)
    print(f'Wrote {json_path}')
    print(f'Wrote {md_path}')


if __name__ == '__main__':
    main()
