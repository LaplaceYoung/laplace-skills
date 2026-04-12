---
name: harness-naming-normalizer
description: Normalize eligible filenames into AI-friendly conventions with safety gates.
---

# Naming Normalizer

## Goals
- improve readability
- reduce ambiguity
- avoid breaking imports/runtime

## Process
1. classify files by risk and file type
2. produce a dry-run rename plan first
3. group safe renames separately from approval-needed renames
4. record every rename in the final change trace

## Helper
- preferred helper: `python scripts/dry_run_rename_scanner.py --repo .`

## Safe by default
- docs
- reports
- templates
- clearly unreferenced metadata files

## Approval required
- import-sensitive files
- route-sensitive files
- build/deploy config files
- files with unclear external references

## Evaluator criteria
- renamed files are easier to understand from the filename alone
- runtime-coupled files are not changed without approval
