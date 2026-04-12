# Governance

## Protected areas
Treat these as protected by default:
- application entrypoints
- build and deployment configs
- routing and runtime wiring
- core business logic
- tests whose names/locations affect execution

## Allowed by default
- add docs and templates
- add inventory/index Markdown
- add plugin/skill metadata docs
- rename only clearly safe, non-runtime-coupled files
- produce dry-run recommendations for risky renames

## Approval required
- core code edits
- runtime-coupled renames
- config changes
- import-path-sensitive moves
