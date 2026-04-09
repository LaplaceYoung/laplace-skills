# Versioning Policy

## Skill version
- `v0.x`: experimental
- `v1.x`: stable local use
- `v2.x+`: breaking redesign or expanded contract

## Template version
- `1.x`: backward-compatible template updates
- `2.x`: migration note required for all existing skills

## Migration rule
When `template_version` changes across major versions, each affected skill must include:
1. migration summary
2. changed sections
3. validation rerun date
