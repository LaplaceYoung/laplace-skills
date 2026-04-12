import argparse
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

PHASES = ['discover', 'classify', 'plan', 'simulate', 'adapt', 'evaluate', 'summarize']


def utc_stamp() -> str:
    return datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')


def load_json(path: Path) -> Dict:
    return json.loads(path.read_text(encoding='utf-8-sig')) if path.exists() else {}


def update_state(state_path: Path, **updates: Dict) -> Dict:
    state = load_json(state_path)
    state.update(updates)
    state['updated_at'] = datetime.now(timezone.utc).isoformat()
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps(state, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    return state


def write_checkpoint(repo_root: Path, run_id: str, phase: str, payload: Dict) -> Path:
    path = repo_root / '.harness' / 'checkpoints' / f'{run_id}-{phase}.json'
    path.parent.mkdir(parents=True, exist_ok=True)
    data = {'run_id': run_id, 'phase': phase, 'timestamp': datetime.now(timezone.utc).isoformat(), 'payload': payload}
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    return path


def write_context(repo_root: Path, run_id: str) -> Path:
    context = {
        'run_id': run_id,
        'repo': str(repo_root),
        'goal': 'Run the harness-friendly adaptation loop with canonical .harness artifacts.',
        'phases': PHASES,
        'constraints': ['Do not modify core code without explicit approval.', 'Keep reports human-readable.'],
    }
    path = repo_root / '.harness' / 'context' / f'{run_id}.json'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(context, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    return path


def write_plan(repo_root: Path, run_id: str) -> Path:
    text = f'''# Harness Loop Plan\n\n- Run ID: {run_id}\n- Canonical state: `.harness/state/loop-state.json`\n- Outputs: `.harness/artifacts/*` and `reports/*`\n\n## Steps\n1. Capture run context\n2. Generate repo inventory\n3. Classify protected areas\n4. Generate adaptation plan\n5. Run dry-run rename scan\n6. Execute low-risk adaptation actions (dry-run by default)\n7. Run harness evaluator + delta evaluator\n8. Copy human-facing reports to `reports/`\n9. Write checkpoints, run summary, and final state\n'''
    path = repo_root / '.harness' / 'plans' / f'{run_id}.md'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8')
    return path


def run_helper(repo_root: Path, script_name: str, extra_args: Optional[List[str]] = None) -> None:
    cmd = ['python', f'scripts/{script_name}', '--repo', '.']
    if extra_args:
        cmd.extend(extra_args)
    subprocess.run(cmd, cwd=repo_root, check=True)


def copy_report(repo_root: Path, source_rel: str, target_rel: str) -> None:
    src = repo_root / source_rel
    if not src.exists():
        return
    dst = repo_root / target_rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst)


def backup_previous_evaluator(repo_root: Path) -> None:
    src = repo_root / '.harness' / 'artifacts' / 'harness-evaluator.json'
    dst = repo_root / '.harness' / 'artifacts' / 'harness-evaluator.previous.json'
    if src.exists():
        try:
            payload = load_json(src)
            current_run = payload.get('run_id')
            if current_run:
                existing_prev = load_json(dst) if dst.exists() else {}
                if existing_prev.get('run_id') == current_run:
                    return
        except Exception:
            pass
        shutil.copyfile(src, dst)


def write_summary(repo_root: Path, run_id: str) -> Path:
    summary = f'''# Harness Loop Summary\n\n- Run ID: {run_id}\n- Canonical context: `.harness/context/{run_id}.json`\n- Canonical plan: `.harness/plans/{run_id}.md`\n- Canonical inventory: `.harness/artifacts/repo-inventory.md`\n- Canonical protected areas: `.harness/artifacts/protected-areas.md`\n- Canonical adaptation plan: `.harness/artifacts/adaptation-plan.md`\n- Canonical rename plan: `.harness/artifacts/rename-plan.md`\n- Canonical low-risk executor: `.harness/artifacts/low-risk-executor.md`\n- Canonical evaluator: `.harness/artifacts/harness-evaluator.md`\n- Canonical delta evaluator: `.harness/artifacts/delta-evaluator.md`\n- Human-facing reports: `reports/*.md` mirror current canonical artifacts\n- Checkpoints: `.harness/checkpoints/{run_id}-*.json`\n\n## Notes\n- The loop is artifact-first and resume-safe.\n- Only low-risk executor actions may be applied, and only when explicitly requested.\n- See the canonical artifacts above for machine-readable loop output.\n'''
    path = repo_root / '.harness' / 'runs' / f'{run_id}-summary.md'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(summary, encoding='utf-8')
    return path


def phase_after(phase: str) -> str:
    if phase not in PHASES:
        return PHASES[0]
    idx = PHASES.index(phase)
    return PHASES[min(idx + 1, len(PHASES) - 1)]


def determine_resume(repo_root: Path, state_path: Path, requested_run_id: Optional[str]) -> tuple[str, str, bool]:
    state = load_json(state_path)
    if requested_run_id:
        return requested_run_id, PHASES[0], False
    if state.get('last_run_id'):
        run_id = state['last_run_id']
        current_phase = state.get('current_phase', 'complete')
        if current_phase == 'complete':
            return run_id, 'summarize', True
        return run_id, current_phase, True
    return f'harness-loop-{utc_stamp()}', PHASES[0], False


def main() -> None:
    parser = argparse.ArgumentParser(description='Run the harness-friendly loop and write canonical .harness artifacts.')
    parser.add_argument('--repo', default='.', help='Repository root')
    parser.add_argument('--run-id', default=None, help='Optional explicit run id')
    parser.add_argument('--resume', action='store_true', help='Resume from current .harness state/checkpoints')
    parser.add_argument('--apply-low-risk', action='store_true', help='Apply low-risk executor actions instead of dry-run only')
    args = parser.parse_args()

    repo_root = Path(args.repo).resolve()
    state_path = repo_root / '.harness' / 'state' / 'loop-state.json'

    if args.resume:
        run_id, start_phase, resumed = determine_resume(repo_root, state_path, args.run_id)
    else:
        run_id, start_phase, resumed = (args.run_id or f'harness-loop-{utc_stamp()}', PHASES[0], False)

    if not resumed:
        update_state(state_path, active=True, current_phase='discover', last_run_id=run_id, state={'repo': str(repo_root), 'artifacts': {}, 'approval_required': [], 'notes': []})
        context_path = write_context(repo_root, run_id)
        plan_path = write_plan(repo_root, run_id)
        write_checkpoint(repo_root, run_id, 'discover', {'context': str(context_path.relative_to(repo_root)), 'plan': str(plan_path.relative_to(repo_root))})
    else:
        context_path = repo_root / '.harness' / 'context' / f'{run_id}.json'
        plan_path = repo_root / '.harness' / 'plans' / f'{run_id}.md'

    start_index = PHASES.index(start_phase)
    if resumed and start_phase != 'discover':
        start_index = PHASES.index(start_phase)

    for phase in PHASES[start_index:]:
        update_state(state_path, active=True, current_phase=phase, last_run_id=run_id)
        if phase == 'discover':
            continue
        if phase == 'classify':
            run_helper(repo_root, 'repo_inventory.py')
            run_helper(repo_root, 'protected_areas.py')
            write_checkpoint(repo_root, run_id, 'classify', {'inventory': '.harness/artifacts/repo-inventory.md', 'protected_areas': '.harness/artifacts/protected-areas.md'})
        elif phase == 'plan':
            run_helper(repo_root, 'adaptation_plan.py')
            write_checkpoint(repo_root, run_id, 'plan', {'adaptation_plan': '.harness/artifacts/adaptation-plan.md'})
        elif phase == 'simulate':
            run_helper(repo_root, 'dry_run_rename_scanner.py')
            write_checkpoint(repo_root, run_id, 'simulate', {'rename_plan': '.harness/artifacts/rename-plan.md'})
        elif phase == 'adapt':
            extra = ['--apply'] if args.apply_low_risk else []
            run_helper(repo_root, 'low_risk_executor.py', extra)
            write_checkpoint(repo_root, run_id, 'adapt', {'executor': '.harness/artifacts/low-risk-executor.md', 'apply_mode': args.apply_low_risk})
        elif phase == 'evaluate':
            backup_previous_evaluator(repo_root)
            run_helper(repo_root, 'harness_evaluator.py', ['--run-id', run_id])
            run_helper(repo_root, 'delta_evaluator.py')
            write_checkpoint(repo_root, run_id, 'evaluate', {'evaluator': '.harness/artifacts/harness-evaluator.md', 'delta': '.harness/artifacts/delta-evaluator.md'})
        elif phase == 'summarize':
            for name in ['repo-inventory', 'protected-areas', 'adaptation-plan', 'rename-plan', 'low-risk-executor', 'harness-evaluator', 'delta-evaluator']:
                copy_report(repo_root, f'.harness/artifacts/{name}.md', f'reports/{name}.md')
                copy_report(repo_root, f'.harness/artifacts/{name}.json', f'reports/{name}.json')
            summary_path = write_summary(repo_root, run_id)
            write_checkpoint(repo_root, run_id, 'summarize', {'summary': str(summary_path.relative_to(repo_root))})
            write_checkpoint(repo_root, run_id, 'complete', {'summary': str(summary_path.relative_to(repo_root))})
            update_state(state_path, active=False, current_phase='complete', state={
                'repo': str(repo_root),
                'artifacts': {
                    'context': str(context_path.relative_to(repo_root)),
                    'plan': str(plan_path.relative_to(repo_root)),
                    'inventory': '.harness/artifacts/repo-inventory.md',
                    'protected_areas': '.harness/artifacts/protected-areas.md',
                    'adaptation_plan': '.harness/artifacts/adaptation-plan.md',
                    'rename_plan': '.harness/artifacts/rename-plan.md',
                    'low_risk_executor': '.harness/artifacts/low-risk-executor.md',
                    'evaluator': '.harness/artifacts/harness-evaluator.md',
                    'delta_evaluator': '.harness/artifacts/delta-evaluator.md',
                    'summary': str(summary_path.relative_to(repo_root)),
                },
                'approval_required': [],
                'notes': ['loop completed successfully'],
            })

    print(f'Run completed: {run_id}')
    print(f'Resumed: {resumed}')
    print(f'Start phase: {start_phase}')


if __name__ == '__main__':
    main()
