# Contracts Artifact Policy

Phase 0 tracks these generated freeze artifacts in git:

- `contract-diff-report.json`
- `parity-coverage-report.json`
- `registry-lock.json`

Regenerate them with:

```bash
pnpm test:contracts
pnpm test:registry
pnpm run check:parity-coverage
```
