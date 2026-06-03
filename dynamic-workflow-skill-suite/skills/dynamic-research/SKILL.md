---
name: dynamic-research
description: Use when the user asks for source-backed research, official-documentation lookup, technical comparison, dependency evaluation, repository investigation plus synthesis, or fan-out research with ranked conclusions.
metadata:
  short-description: Source-backed research workflow
---

# Dynamic Research

Use this skill for source-backed research that needs traceable evidence and ranked conclusions.

## Research Contract

Start by defining:
- research question
- decision being supported
- required source quality
- recency requirements
- output format
- stop condition

When facts may have changed, verify with current primary sources.

## Workflow

1. Split the research question into independent subquestions.
2. Prefer primary sources: official docs, release notes, standards, repository files, papers, or vendor documentation.
3. Use `researcher` for external official docs when subagent research is requested.
4. Use `explore` for local repository mapping when local code matters.
5. Use `dependency-expert` for package, SDK, or framework selection.
6. Synthesize evidence into ranked conclusions.
7. Separate sourced facts from inferences.

## Evidence Rules

Include links for external sources. Include file references for local repository evidence. Treat current dates, versions, pricing, legal, security, and API behavior as verification-sensitive.

## Output

Return:
- answer first
- key evidence
- ranked options or conclusions
- assumptions
- recommended next action
