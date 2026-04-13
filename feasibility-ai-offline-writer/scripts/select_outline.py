#!/usr/bin/env python3
import argparse
import json
from pathlib import Path
from collections import defaultdict

DATA_PATH = Path(__file__).resolve().parent.parent / 'assets' / 'outlines.json'
DATA = json.loads(DATA_PATH.read_text(encoding='utf-8'))
INDEX = defaultdict(lambda: defaultdict(list))
for k in sorted(DATA):
    parts = k.split('/')
    if len(parts) >= 3 and parts[0].startswith('A'):
        INDEX[parts[0]][parts[1]].append((parts[2], DATA[k]))

parser = argparse.ArgumentParser(description='Select recovered outline families.')
parser.add_argument('--list-majors', action='store_true', help='List major families')
parser.add_argument('--major', help='Major family, e.g. A1')
parser.add_argument('--list-subgroups', action='store_true', help='List subgroups under --major')
parser.add_argument('--subgroup', help='Subgroup under the chosen major')
parser.add_argument('--search', help='Search outline keys by substring')
args = parser.parse_args()

if args.list_majors:
    print('\n'.join(sorted(INDEX.keys())))
elif args.search:
    needle = args.search.lower()
    for k in sorted(DATA):
        if needle in k.lower():
            print(k)
elif args.major and args.list_subgroups:
    if args.major not in INDEX:
        raise SystemExit(f'Unknown major: {args.major}')
    print('\n'.join(sorted(INDEX[args.major].keys())))
elif args.major and args.subgroup:
    rows = INDEX.get(args.major, {}).get(args.subgroup, [])
    if not rows:
        raise SystemExit('No matching subgroup entries')
    for name, payload in rows:
        print(f'## {args.major}/{args.subgroup}/{name}')
        if isinstance(payload, dict):
            keys = ', '.join(payload.keys())
            print(f'keys: {keys}')
        print()
else:
    parser.print_help()
