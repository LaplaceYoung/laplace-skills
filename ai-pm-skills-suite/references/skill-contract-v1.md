# Skill Contract v1.1

## 1. Required metadata
Every skill must define:
- `name`
- `description`
- `version`
- `template_version`
- `owner`
- `cn_title`
- `en_alias`
- `skill_family`
- `primary_artifact`

## 2. Required activation contract
Each skill must explicitly state:
- trigger signals
- activation conditions
- do-not-use conditions
- stop-and-escalate rules

## 3. Required input schema
Each skill must declare:
- required inputs
- optional inputs
- assumptions
- unsupported cases

## 4. Required tool contract
Each skill must include a tool-category table that explains:
- category name
- typical tool types
- enable conditions
- avoid conditions
- expected evidence

Recommended categories:
- local docs/files
- structured docs
- data analysis
- web research
- no-browse reasoning

## 5. Required workflow contract
Each skill must contain a concrete numbered process with task clarity:
1. intake / scope check
2. evidence collection / tool selection
3. analysis or drafting
4. artifact generation
5. self-check
6. final response

## 6. Required output contract
Each skill must produce:
- a primary artifact
- a short decision / recommendation summary
- explicit next steps or escalation path
- when relevant, a checklist / matrix / table as supporting structure
- a strict output schema block that declares required sections and minimal required fields

## 7. Failure mode taxonomy
Use one of:
- `missing_context`
- `conflicting_constraints`
- `low_confidence`
- `out_of_scope`

## 8. Artifact shape
Preferred sections:
1. Context / goal
2. Analysis or reasoning summary
3. Deliverable artifact
4. Risks / assumptions
5. Next actions

## 9. Quality thresholds for promotion
- Format compliance >= 95%
- Average rubric >= 85/100
- Manual rewrite rate <= 20%
- Critical hallucinations = 0
- CN/EN key-field consistency >= 95%

## 10. Hallucination adjudication flow
1. Worker/self-check flags suspected unsupported claims.
2. Verifier or critic confirms whether the claim is unsupported.
3. Any confirmed critical hallucination fails the run and blocks promotion.
