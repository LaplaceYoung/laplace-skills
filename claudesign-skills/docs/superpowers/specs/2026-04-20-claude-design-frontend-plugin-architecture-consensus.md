# RALPLAN Consensus Plan — Claude Design Frontend Plugin Architecture (Full Parity, Critic-Ready Rev)

**Date:** 2026-04-20  
**Grounding:**
- `.omx/context/claude-design-frontend-plugin-architecture-20260420T142437Z.md`
- `docs/superpowers/specs/2026-04-20-claude-design-codex-full-parity-design.md`
- `docs/superpowers/plans/2026-04-20-claude-design-codex-full-parity-plan.md`

## 1) RALPLAN-DR (Deliberate Mode)

### Principles
1. Full behavioral parity for parity-critical workflows.
2. Hybrid B/C: plugins deliver UX routing; MCP contracts own mutation and validation.
3. Shared versioned contract package and command registry across skills/plugins/MCP/CI.
4. Evidence-first phase gates with deterministic artifacts.
5. Vertical slices with strict governance and rollback readiness.

### Decision Drivers (Top 3)
1. Parity coverage for source capabilities.
2. Contract integrity across distributed lanes.
3. Reproducible operations for browser verification and export.

### Viable Options + rough cost/complexity

| Option | Dev Cost (rough) | Ops Complexity | Benefit |
| --- | --- | --- | --- |
| A. Single monorepo plugin | 3–4 engineer-weeks | Medium | fastest demo path |
| B/C Hybrid (chosen) | 5–7 engineer-weeks | Medium-high | strongest parity + scalability balance |
| C. MCP-first thin plugins | 4–6 engineer-weeks | High | strongest API isolation |

### Pre-mortem mini runbooks

#### Scenario 1: Contract drift
- **Early signals:** `contracts` CI lane failures, schema hash mismatch, registry lookup misses.
- **Owner:** Architect + MCP Engineer.
- **Containment action:** freeze merges to affected commands, regenerate SDK, re-lock registry.
- **Rollback path:** revert contract package to previous compatible tag and re-run compatibility matrix.
- **Evidence artifact:** `artifacts/contracts/contract-diff-report.json`.

#### Scenario 2: Browser flake growth
- **Early signals:** e2e retry rate spike, flake budget breach, unstable screenshot diffs.
- **Owner:** Browser QA Engineer.
- **Containment action:** pin engine policy for affected suites, quarantine flaky tests with tracking ticket.
- **Rollback path:** revert recent browser-policy/config changes and restore last passing baseline traces.
- **Evidence artifact:** `artifacts/observability/flake-budget-report.json`.

#### Scenario 3: Marketplace resolver conflict
- **Early signals:** dependency graph resolution failures, contract-range intersection failures.
- **Owner:** Platform QA Engineer + Plugin Engineer.
- **Containment action:** pin conflict pair, block channel promotion, publish compatibility advisory.
- **Rollback path:** demote conflicting plugin versions to prior channel and rerun resolver suite.
- **Evidence artifact:** `artifacts/compat/compatibility-report.json`.

---

## 2) Architecture plan (refined)

### 2.1 Hybrid B/C synthesis
- Plugins are UX-facing routers.
- MCP tools are source of truth for mutation/validation.
- Shared packages:
  - `@claude-design/contracts`
  - `@claude-design/command-registry`

### 2.2 Contract Catalog (initial)

| Command ID | Capability | Req/Resp Schema | Owner | Lifecycle | Deprecation Window |
| --- | --- | --- | --- | --- | --- |
| `runtime.questions.build.v1` | `questions_v2` | `BuildQuestionsReq/Resp` | runtime | active | 2 minors |
| `runtime.template.save.v1` | `save_as_template` | `SaveTemplateReq/Resp` | runtime | active | 2 minors |
| `assets.register.v1` | `register_assets` | `RegisterAssetsReq/Resp` | assets | active | 2 minors |
| `assets.unregister.v1` | `unregister_assets` | `UnregisterAssetsReq/Resp` | assets | active | 2 minors |
| `artifact.create.v1` | `html_artifact_create` | `CreateArtifactReq/Resp` | artifacts | active | 2 minors |
| `preview.open.v1` | `show_html` | `OpenPreviewReq/Resp` | preview | active | 2 minors |
| `preview.inspect.v1` | `get_webview_logs` | `InspectPreviewReq/Resp` | preview | active | 2 minors |
| `verify.done_gate.v1` | `done` | `DoneGateReq/Resp` | verifier | active | 2 minors |
| `verify.run.v1` | `fork_verifier_agent` | `RunVerifierReq/Resp` | verifier | active | 2 minors |
| `export.pptx.v1` | `gen_pptx` | `ExportPptxReq/Resp` | export | active | 2 minors |
| `export.bundle_html.v1` | `super_inline_html` | `BundleHtmlReq/Resp` | export | active | 2 minors |
| `export.pdf_print.v1` | `open_for_print` | `ExportPdfReq/Resp` | export | active | 2 minors |

### 2.3 Parity-critical command baseline and completeness proof
- **Canonical source:** `docs/superpowers/mappings/2026-04-20-source-to-codex-capability-map.md`.
- **Baseline file:** `docs/superpowers/mappings/2026-04-20-parity-critical-command-baseline.md`.
- **Coverage rule:** every baseline command maps to exactly one active command ID in catalog.
- **Coverage check job:** `ci.contracts.parity_coverage`.
- **Coverage artifact:** `artifacts/contracts/parity-coverage-report.json`.
- **Pass threshold:** `coverage_ratio = 1.00` and `unmapped_count = 0`.

### 2.4 Ownership Matrix

| Entity | Single Writer | Readers | Mutation Path |
| --- | --- | --- | --- |
| `ProjectManifest` | runtime MCP | all plugins, skills, CI | skill → runtime plugin → `runtime.*` |
| `AssetManifest` | assets MCP | artifacts/export/browser/verifier | plugin → `assets.*` |
| `ArtifactManifest` | artifacts MCP | browser/export/verifier/runtime | plugin → `artifact.*` |
| `VerificationReport` | verifier MCP | browser/export/CI/release gate | browser plugin → `verify.*` |
| `ExportBundle` | export MCP | runtime/browser/CI | export plugin → `export.*` |
| `RunRecord` | runtime MCP | observability/CI/audit | plugin event → runtime ingest |

### 2.5 MCP/API Boundary Table

| Tool | Idempotency | Timeout/Retry | Error Taxonomy | Correlation-ID |
| --- | --- | --- | --- | --- |
| `runtime.questions.build` | idempotent | 5s / retry1 | `VALIDATION`,`CONTRACT_VERSION`,`INTERNAL` | required in/out |
| `runtime.template.save` | key-idempotent | 10s / retry0 | `VALIDATION`,`CONFLICT`,`INTERNAL` | required in/out |
| `assets.register` | key-idempotent | 10s / retry1 | `VALIDATION`,`CONFLICT`,`IO`,`INTERNAL` | required in/out |
| `artifact.create` | non-idempotent | 20s / retry0 | `VALIDATION`,`STATE`,`INTERNAL` | required in/out |
| `preview.open` | key-idempotent | 15s / retry1 | `STATE`,`ENGINE`,`TIMEOUT` | required in/out |
| `verify.done_gate` | key-idempotent | 30s / retry0 | `STATE`,`ENGINE`,`ASSERTION` | required in/out |
| `export.pptx` | non-idempotent | 60s / retry0 | `STATE`,`EXPORT`,`IO` | required in/out |
| `export.bundle_html` | idempotent by hash | 45s / retry0 | `STATE`,`EXPORT`,`IO` | required in/out |

### 2.6 Browser Engine Policy
1. DevTools MCP for interactive diagnostics and directed probes.
2. Playwright for deterministic regression and canonical release evidence.
3. Fallback trigger: one classified `ENGINE` failure or timeout breach in suite.
4. Canonical evidence source: Playwright pack (`trace.zip`, screenshots, console log export).
5. Flake budget threshold: weekly flake rate `<= 1.5%`; gate hold above threshold.

### 2.7 Marketplace schema + resolver rules
- Schema fields: `plugin_id`, `version`, `channel`, `capabilities[]`, `contracts_range`, `dependencies[]`, `peer_dependencies[]`, `owners[]`, `quality_tier`.
- Semver policy: caret ranges for plugin minors, exact pin for `@claude-design/contracts` major.
- Resolver behavior: highest compatible in channel, acyclic graph enforcement, contract-range intersection pass.
- Channel gates:
  - `alpha→beta`: contracts + integration pass.
  - `beta→stable`: e2e + compatibility + flake budget + parity threshold pass.

### 2.8 Measurable thresholds and release blockers
- **Parity score threshold:** `>= 0.97` on weighted parity scorecard.
- **Observability smoke criteria:** correlation-ID continuity `= 100%`, structured error-code rate capture `>= 99%`, run-record ingestion latency `p95 <= 5s`.
- **Compatibility pass conditions:** resolver success `= 100%` on target matrix, contract conformance `= 100%`, critical-flow matrix pass `>= 99%`.
- **Explicit release blockers:**
  1. parity score `< 0.97`
  2. coverage job fail or `unmapped_count > 0`
  3. compatibility report status `red`
  4. flake budget breach
  5. missing required release artifacts

---

## 3) Phase gates with concrete command/job/artifact/pass rules

| Phase | Verification Commands | CI Jobs | Required Artifacts | Pass/Fail Rule |
| --- | --- | --- | --- | --- |
| Phase 0 Contract Freeze | `pnpm test:contracts && pnpm test:registry && pnpm run check:parity-coverage` | `ci.contracts.schemas`, `ci.contracts.registry`, `ci.contracts.parity_coverage` | `artifacts/contracts/contract-diff-report.json`, `artifacts/contracts/parity-coverage-report.json`, `artifacts/contracts/registry-lock.json` | pass when all jobs green and coverage_ratio=1.00 |
| Phase 1 Vertical Slice | `pnpm test:integration --filter slice-core && pnpm test:e2e --grep "intake|artifact|preview|done|verifier"` | `ci.integration.slice_core`, `ci.e2e.slice_core` | `artifacts/e2e/slice-core-report.json`, `artifacts/verifier/done-gate-report.json` | pass when critical flow set all pass |
| Phase 2 Export Completeness | `pnpm test:integration --filter export && pnpm run check:export-conformance` | `ci.integration.export`, `ci.conformance.export` | `artifacts/export/export-conformance-report.json`, `artifacts/export/checksum-report.json` | pass when conformance=100% and checksum stable |
| Phase 3 Marketplace Enablement | `pnpm run resolve:compat && pnpm test:compat` | `ci.compat.resolver`, `ci.compat.matrix` | `artifacts/compat/compatibility-report.json`, `artifacts/compat/resolution-graph.json` | pass when resolver success=100% and report=green |
| Phase 4 Hardening/Release | `pnpm test && pnpm test:e2e && pnpm run smoke:observability && pnpm run score:parity` | `ci.full.regression`, `ci.observability.smoke`, `ci.release.parity_score` | `artifacts/release/parity-scorecard.json`, `artifacts/observability/smoke-report.json`, `artifacts/release/release-readiness.json` | pass when thresholds all met and blockers count=0 |

### Nightly integration merge policy
- Merge window requires green status on `ci.contracts.*`, `ci.integration.slice_core`, and `ci.compat.matrix`.
- Merge commit requires attached `artifacts/compat/compatibility-report.json` and `artifacts/observability/flake-budget-report.json`.

### Freeze-exception ADR workflow
1. Create ADR at `docs/adr/ADR-freeze-exception-YYYYMMDD.md` with risk and rollback steps.
2. Architect + Critic approvals recorded in ADR metadata.
3. Run scoped regression command set and attach artifacts.
4. Merge with `exception-approved` label and post-merge retro ADR update.

---

## 4) Expanded test suite inventory

| Suite Name | Type | Fixture Set | Expected Outputs | CI Lane |
| --- | --- | --- | --- | --- |
| `contracts-schema-roundtrip` | unit | `fixtures/contracts/*` | schema compile pass + roundtrip pass | `contracts` |
| `registry-lifecycle-rules` | unit | `fixtures/registry/*` | lifecycle/deprecation validation report | `contracts` |
| `ownership-mutation-guard` | integration | `fixtures/manifests/*` | single-writer audit pass | `integration` |
| `skill-plugin-mcp-chain` | integration | `fixtures/flows/slice-core/*` | typed request/response trace with correlation IDs | `integration` |
| `export-conformance-suite` | integration | `fixtures/exports/*` | pptx/pdf/html conformance pass + checksums | `integration` |
| `preview-verifier-regression` | e2e | `fixtures/artifacts/{prototype,deck,animation,design-system}` | trace + screenshot baseline + verifier verdict | `e2e` |
| `parity-critical-e2e` | e2e | baseline parity fixtures | parity flow pass map | `e2e` |
| `observability-smoke-suite` | observability | synthetic and fixture runs | smoke report with ID continuity and latency metrics | `observability` |
| `compatibility-resolver-matrix` | compatibility | marketplace version matrix | compatibility report status green | `compatibility` |

---

## 5) ADR

### Decision
Adopt B/C hybrid architecture with shared contracts and command registry as platform truth.

### Drivers
1. Full parity coverage.
2. Contract-safe parallel execution.
3. Marketplace-ready extensibility.

### Alternatives considered
- Single plugin monolith.
- Domain plugins without shared contract package.
- MCP-first thin plugin strategy.

### Why chosen
Hybrid B/C maximizes parity reliability and ecosystem scalability with clear ownership boundaries.

### Consequences
- Contract governance and compatibility CI become first-class platform responsibilities.
- Lane parallelism and integration discipline both increase.

### Follow-ups
1. Publish `@claude-design/contracts@1.0.0` and `@claude-design/command-registry@1.0.0`.
2. Generate SDK bindings from catalog schemas.
3. Automate release-blocker checks in `ci.release.parity_score`.

---

## 6) Available-agent-types roster + execution hints

### Agent types
Architect, Plugin Engineer, Skill Engineer, MCP Engineer, Browser QA Engineer, Platform QA Engineer, Critic.

### Staffing
- Lane A: Architect + MCP Engineer (contracts and boundaries).
- Lane B: Plugin Engineer + Skill Engineer (routing and UX surfaces).
- Lane C: Browser QA + Platform QA (verification and release gates).

### Suggested reasoning levels by lane
- Lane A: high
- Lane B: medium-high
- Lane C: high

### Ralph hints
- Execute sequential phase locks with mandatory artifacts per gate.
- Suggested launch: `$ralph "Implement Phase 0 contract freeze for Claude Design parity using docs/superpowers/specs/2026-04-20-claude-design-codex-full-parity-design.md and .omx/plans/2026-04-20-claude-design-frontend-plugin-architecture-ralplan.md"`

### Team hints
- Start parallel lanes after Phase 0 freeze; enforce nightly merge policy.
- Suggested launch: `omx team run "Lane A contracts, Lane B routing, Lane C verification for Claude Design parity"`
- Alternate launch: `$team "Lane A contracts + Lane B routing + Lane C verification for Claude Design parity"`

### Verification path
1. Architect gate review.
2. Cross-lane compatibility and critical e2e run.
3. Critic audit against RALPLAN-DR and ADR.
4. Release recommendation package.
