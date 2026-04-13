#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / 'assets' / 'prompts.json'
DATA = json.loads(DATA_PATH.read_text(encoding='utf-8'))

parser = argparse.ArgumentParser(description='Lookup recovered prompt entries.')
parser.add_argument('--list-groups', action='store_true', help='List top-level prompt groups')
parser.add_argument('--group', help='List keys under a group, e.g. system or experts')
parser.add_argument('--key', help='Show one exact prompt key')
parser.add_argument('--search', help='Search keys and text for a substring')
args = parser.parse_args()

if args.list_groups:
    groups = sorted({k.split('/')[0] for k in DATA})
    print('\n'.join(groups))
elif args.group:
    keys = [k for k in sorted(DATA) if k.split('/')[0] == args.group]
    print('\n'.join(keys))
elif args.key:
    value = DATA.get(args.key)
    if value is None:
        raise SystemExit(f'Key not found: {args.key}')
    print(json.dumps(value, ensure_ascii=False, indent=2))
elif args.search:
    needle = args.search.lower()
    matches = []
    for k, v in DATA.items():
        blob = k.lower() + '\n' + json.dumps(v, ensure_ascii=False).lower()
        if needle in blob:
            matches.append(k)
    print('\n'.join(sorted(matches)))
else:
    parser.print_help()
