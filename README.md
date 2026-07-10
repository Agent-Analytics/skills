# Agent Analytics Skills

Product analytics with your AI agent.

This package installs the two canonical Agent Analytics skills for coding-agent workflows: one compact operating skill for setup, instrumentation, analytics reads, and experiment operations, and one structured autoresearch skill for review-ready growth variants.

```bash
npx skills add agent-analytics/skills
```

List the available skills without installing:

```bash
npx skills add agent-analytics/skills --list
```

Install one skill explicitly:

```bash
npx skills add agent-analytics/skills --skill agent-analytics
npx skills add agent-analytics/skills --skill agent-analytics-autoresearch
```

This repo intentionally contains only public skill definitions. The CLI is the execution substrate for live Agent Analytics work; the scanner is an optional helper for URL-only or no-code audits, not the source of truth when repository code is available.

## Skills

### `agent-analytics`

Product analytics with your AI agent: the operating skill for using the official Agent Analytics CLI to set up measurement, read product signals, diagnose activation and retention, run experiments, and keep compact product context close to the data.

Use it when you want an agent to:

- classify whether work belongs to a project, a surface inside a project, or a related-project portfolio before setup, analytics reads, or instrumentation recommendations; see <https://docs.agentanalytics.sh/guides/projects-surfaces-portfolios/>
- create or identify the right project and install the project-owned tracker with consent
- treat the base tracker snippet as the start of instrumentation, not the full instrumentation plan
- add only meaningful custom events tied to this repo's product workflows and explain what each event enables
- avoid custom duplicates for automatic tracker signals such as page views, paths, referrers, UTMs, sessions, device/browser, country, and first-touch attribution
- use tracker capabilities deliberately for named CTAs, signup intent, pricing interactions, checkout steps, install/setup progress, activation milestones, `data-aa-event`, `data-aa-impression`, `window.aa.track(...)`, server-side tracking, and optional scroll depth, forms, downloads, vitals, errors, performance, and SPA tracking only when they unlock a concrete decision
- verify the first useful event after setup
- read and maintain compact Project Context: goals, activation events, event-name glossary entries, and date annotations for major landing page, pricing, onboarding, feature, release, or experiment changes
- configure cross-project identity stitching only when intentional, using both tracker `data-link-domains` and `portfolios create/update`
- answer product analytics questions with a decision, metric definition, evidence, caveat, and one bounded next action

Copyable setup task:

```text
Set up Agent Analytics for this project. If browser approval is needed, open it and wait for me. I will sign in with Google or GitHub and approve it. If the browser callback cannot resume you, ask me for the finish code as a fallback. After that, create or identify the matching Agent Analytics project, install the project-owned tracker, add only meaningful custom events tied to this repo's product workflows, explain what each event enables, and verify the first useful event.
```

Use normal browser approval first in Claude Code, Codex, Cursor, and local CLI runtimes:

```bash
npx --yes @agent-analytics/cli@0.5.34 login
npx --yes @agent-analytics/cli@0.5.34 create my-site --domain https://mysite.com
npx --yes @agent-analytics/cli@0.5.34 events my-site --event <first_useful_event> --days 7 --limit 20
```

Use `login --detached` only for Paperclip, OpenClaw, issue-based or headless runtimes, or when the local browser callback cannot work.

For paid-tier blocks, run the intended command first. If the CLI returns `PRO_REQUIRED` or a free-tier read cap, use the CLI upgrade handoff. The dashboard page first confirms the same account as the CLI, shows the blocked command and reason, and then opens payment.

### `agent-analytics-autoresearch`

The Autoresearch skill runs a structured growth loop for landing pages, onboarding, pricing, CTAs, signup, checkout, activation, and experiment candidates.

It can use Agent Analytics, PostHog, GA4, Mixpanel, SQL, CSV exports, product logs, screenshots summarized by the user, or a written data brief. It works best with Agent Analytics because the agent can pull fresh snapshots through the CLI/API, inspect funnels and events, and use experiment results in the next run.

When using Agent Analytics data, Autoresearch should read Project Context before a snapshot and feed back only durable product truth after human correction or measured evidence. It should not store noisy round notes, weekly numbers, temporary spikes, pasted reports, PII, or unconfirmed guesses as project memory.

Use it when you want the agent to:

- collect or read an analytics snapshot
- preserve product truth and drift constraints
- generate, critique, synthesize, and blind-rank variants
- output two review-ready variants for an A/B test
- rerun after live experiment data arrives

Related canonical links:

- Package repo: <https://github.com/Agent-Analytics/skills>
- Agent Analytics: <https://agentanalytics.sh>
- Docs: <https://docs.agentanalytics.sh/>
- CLI package: <https://github.com/Agent-Analytics/agent-analytics-cli>
- Autoresearch Growth template: <https://github.com/Agent-Analytics/autoresearch-growth>
