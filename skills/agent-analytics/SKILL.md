---
name: agent-analytics
description: "Product analytics with your AI agent: set up consent-based tracking, read funnels, paths, retention, experiments, and context, read Web Vitals or page speed with the Pro vitals read (p75 headline, rating, and cwv_pass), read numeric property metrics such as sum of revenue, group one query by a single properties.<key>, use read-only SQL (run_sql or aa sql) only when query or breakdown cannot express it, read one shipped change on ship day + 8 with compare (metric, metric_event page_view, and better=lower for vitals) plus an errors guardrail, then recommend the smallest growth action using the official Agent Analytics CLI."
version: 4.0.41
author: dannyshmueli
license: MIT
repository: https://github.com/Agent-Analytics/skills
homepage: https://agentanalytics.sh
compatibility: Requires npx. Browser approval is the normal sign-in path. Detached approval plus finish-code handoff is for Paperclip, OpenClaw, issue-based or headless runtimes, or failed callback environments. Normal setup does not require an API key.
tags:
  - analytics
  - product-analytics
  - tracking
  - funnels
  - retention
  - experiments
  - growth
provides:
  - capability: analytics
  - capability: product-analytics
  - capability: ab-testing
  - capability: funnels
  - capability: retention
metadata:
  openclaw:
    requires:
      anyBins:
        - npx
---

# Agent Analytics

Product analytics with your AI agent. Use this skill when a user wants an agent to install Agent Analytics, query product behavior, diagnose activation or retention, inspect paths and funnels, run experiment reads, read Web Vitals or page speed, read numeric property metrics, group a query by one event property, use read-only SQL only when query and breakdown cannot express the question, read one shipped change on ship day + 8, check new errors since that ship, or decide what growth action to take next.

The CLI is the execution substrate. Start from the user's codebase, project goals, and product workflows whenever repo access exists. Framework recipes belong in `references/growth-recipes.md`, not as separate skills.

## Mandatory execution policy

- For live Agent Analytics work, use `npx --yes @agent-analytics/cli@0.5.43 <command>`.
- Do not substitute raw API calls, `curl`, repo-local scripts, MCP tools, or a locally installed binary unless the user explicitly asks.
- Use fixed commands first: `projects`, `all-sites`, `create`, `stats`, `insights`, `events`, `properties`, `properties-received`, `breakdown`, `pages`, `paths`, `journey`, `sessions`, `sessions-dist`, `replays`, `retention`, `funnel`, `experiments`, `context`, `compare`, `annotate`, `errors`, `vitals`, `portfolios`, `feedback`, and `upgrade-link`.
- There is no `report` command in CLI `0.5.43`. Produce the final report yourself from fixed-command outputs instead of calling `report`.
- For any Web Vitals or page speed question, the first read is the vitals read. CLI `vitals`, MCP `web_vitals`, and API `POST /vitals` are that read. It is Pro and costs one read per call. Use `query` only for narrow aggregations the fixed commands cannot answer, including Pro numeric metrics `sum`, `avg`, `p50`, `p75`, and `p95` with `--property`. `group_by` on that query may add one `properties.<key>`. Use MCP `run_sql` or CLI `aa sql` only when `query` and `breakdown` cannot express the question. Do not start a vitals question with `query`. Do not start broad growth diagnosis with `query`; do not build `--filter` JSON from raw user text. The shipped-change read is `compare`, which is free on all plans and costs one read per call. `compare` with `metric` stays free. The `errors` read is Pro and costs one read per call.
- Default to browser approval. Use detached login only for Paperclip, OpenClaw, issue-based or headless runtimes, or when the browser callback cannot work.
- Do not ask for raw API keys or secrets. Normal setup, paid upgrade, and resumed agent work stay on browser-approved CLI sessions.
- Request the lowest level that fits. Read is the default. Request manage only when the user asked to change data or erase someone. Name the project at login: `login --project <name> --level read`. A 404 on another project means the session is limited to its granted project.
- When the account has no project yet, or the user asks to create one, log in with `--level admin` and no `--project` (All projects), run create, then use read or manage for normal work. Creating a project needs admin with All projects. Context, annotations, experiments, feedback and replay writes need manage.
- `whoami` shows the granted project and level; `legacy` means an older all-projects session.
- If the CLI returns `PRO_REQUIRED` or a free-tier read cap, explain the blocked answer, run `upgrade-link --detached`, send the dashboard handoff, run `whoami` after upgrade, then rerun the blocked command. Use `upgrade-link --wait` only when polling is intentionally desired. The dashboard page first confirms the same account as the CLI. Keep the full retry command and private analysis context in the agent session; browser links use a fixed reason and omit custom commands.
- Validate project names before `create`: `^[a-zA-Z0-9._-]{1,64}$`.

## Auth and setup

For Claude Code, Codex, Cursor, and local CLI runtimes, start with normal browser approval. When the project already exists, name it: `login --project <name> --level read`. Request the lowest level that fits. Read is the default. Request manage only when the user asked to change data or erase someone. When the account has no project yet, or the user asks to create one, log in with `--level admin` and no `--project` (All projects), run create, then use read or manage for normal work.

```bash
npx --yes @agent-analytics/cli@0.5.43 login --level admin
npx --yes @agent-analytics/cli@0.5.43 create my-site --domain https://mysite.com
npx --yes @agent-analytics/cli@0.5.43 login --project my-site --level read
npx --yes @agent-analytics/cli@0.5.43 events my-site --event <first_useful_event> --days 7 --limit 20
```

Creating a project needs admin with All projects. Context, annotations, experiments, feedback and replay writes need manage. Pass `--project <name> --level read` on `login --detached` as well. For a new project, detached login is `login --detached --level admin` with no `--project`. A 404 on another project means the session is limited to its granted project. `whoami` shows the granted project and level; `legacy` means an older all-projects session.

Do not choose detached login just because the work is happening inside an agent. For Paperclip, OpenClaw, and other issue-based runtimes, run `login --detached`, send the approval URL, wait for the finish code, then complete the printed exchange command.

In OpenClaw and similar managed runtimes, use persistent auth storage and never commit it:

```bash
export AGENT_ANALYTICS_CONFIG_DIR="$PWD/.openclaw/agent-analytics"
npx --yes @agent-analytics/cli@0.5.43 login --detached --project <name> --level read
npx --yes @agent-analytics/cli@0.5.43 auth status
AGENT_ANALYTICS_CONFIG_DIR="$PWD/.openclaw/agent-analytics" npx --yes @agent-analytics/cli@0.5.43 projects
```

`--config-dir "$PWD/.openclaw/agent-analytics"` is also valid. Never commit `.openclaw/agent-analytics/config.json`. See `references/setup-auth.md` for more setup detail.

## Classification before action

Agent Analytics is project-first and portfolio-aware. Before setup, analytics reads, or instrumentation recommendations, classify the target as project-local work, a surface inside a project, or related-project portfolio work.

- A project is the unit of local product learning. It owns events, activation, retention, lifecycle, releases, experiments, goals, and project_context.
- One project can include many surfaces: app, marketing, docs, blog, pricing, signup, onboarding, subdomains, mobile clients, local preview URLs, and deploy previews.
- A portfolio is the cross-project growth system for related projects. It connects intentionally grouped portfolio projects for shared goals, roles, milestones, and identity-aware reads when configured.
- Keep project-local truth local. Do not let portfolio context overwrite per-project activation, event meanings, lifecycle, or goals.

Decision rules: subdomains are usually surfaces; mobile app is a surface when it shares activation and lifecycle; free tool is a surface when it feeds the same product loop; localhost, staging, local network URLs, and previews are setup or QA surfaces; separate products belong as separate projects under one portfolio. If a URL does not match expectations, do not treat it as immediate failure. Clarify which project and surface it belongs to.

Scope commands: project-local setup or analysis uses project commands; related-project grouping uses `portfolios create`, `portfolios update`, and `portfolios list`; shared goals, roles, and milestones belong in portfolio interpretation only. Canonical docs: <https://docs.agentanalytics.sh/guides/projects-surfaces-portfolios/>.

For cross-project identity stitching, configure both sides: tracker `data-link-domains` carries the anonymous `_aa` value across related domains, but only server-side portfolio scope makes separate projects share identity. Use an identity portfolio with `portfolios create`, `portfolios update`, and `portfolios list` for the membership boundary and privacy-first email lookup scope. `data-link-domains` alone decorates links but does not make separate projects share identity. Do not claim strict user conversion across projects unless both sides are configured.

## Consent-based tracker setup policy

When installing tracking or events, use a consent-based, project-owned workflow. Do not guess. Do not overtrack. Do not install generic events that do not map to user-confirmed product goals or a specific workflow in the repo.

Setup order:

1. Classify project/surface/portfolio scope.
2. Ask for or propose the initial project/portfolio goal and get confirmation before storing durable context.
3. Inspect routes, forms, CTA handlers, auth/setup/checkout flows, existing analytics calls, server-side durable outcomes, and tests when repo access exists.
4. Login if needed.
5. Create or identify the project with `create <project> --domain <origin>` or `projects`; `--domain` is a setup origin, not the project identity.
6. Add the exact tracking snippet returned for that project. Default install snippets include `data-track-vitals="true"`. Keep that attribute. `data-track-vitals="false"` is explicit off. Treat the base tracker snippet as the start of instrumentation, not the full instrumentation plan.
7. Add the smallest named set of meaningful events and tracker opt-ins needed for the user's confirmed goals.
8. Prefer named CTA clicks, signup intent, pricing interactions, checkout progress or completion, install/setup steps, activation milestones, and durable server-side outcome events such as `signup_completed`, `subscription_started`, `install_completed`, `project_created`, or `first_event_received`.
9. Map needs to tracker capabilities: `data-aa-event`, `data-aa-impression`, `window.aa.track(...)`, server-side tracking, `aa.identify(...)`, and `aa.set(...)`. The default snippet includes `data-track-vitals="true"`. Use scroll depth, form tracking, downloads, errors, performance, and SPA tracking only when they unlock a concrete growth decision.
10. Do not add duplicate custom events for automatic signals: page views, paths, referrers, UTMs, sessions, days since first visit, first-touch attribution, device/browser fields, or country.
11. Explain what each event enables, verify the first useful event with `events <project>`, and summarize what the installed events now let the user's agent answer.

Copyable setup handoff:

```text
Set up Agent Analytics for this project. If browser approval is needed, open it and wait for me. I will sign in with Google or GitHub and approve it. If the browser callback cannot resume you, ask me for the finish code as a fallback. After that, create or identify the matching Agent Analytics project, ask me to confirm the initial product goal before storing durable context, install the project-owned tracker, add only meaningful custom events tied to this repo's product workflows and that goal, explain what each event enables, and verify the first useful event.
```

## Product context loop

Use `context get` and `context set` as compact self-improving memory. At the start of any project-specific analysis, run `context get <project>` after resolving the project. `context set` replaces the stored context; always read the existing context first, merge your change, and preserve still-valid goals, activation events, glossary entries, and annotations.

Keep context short. Save durable product truth: goals, activation definitions, event meanings tied to `event_name`, and date annotations for major product changes: landing page, pricing, onboarding, feature, release, or experiment changes. Before updating glossary entries, inspect current event names with `properties <project>` or `properties-received <project>`.

Skip noisy findings: weekly metric values, temporary spikes, pasted reports, raw round notes, long notes, user lists, PII, secrets, git commit logs, and guesses. Do not store git commit logs. Do not invent unsupported fields such as `findings`, `learnings`, or `open_questions`; store only what fits `goals`, `activation_events`, event-name `glossary`, and `annotations`.

Annotations use `occurred_at`, `title`, and optional `note`. Add one annotation with `annotate` (MCP `append_project_annotation`) so the rest of the stored context stays in place. Keep them rare: max 100, JSON body up to 512KB. Analytics responses include annotations only for the requested analytics date range plus one day before and after; `context get` returns all annotations. For multi-project or multi-domain systems, keep activation and glossary separate unless the human explicitly says they share meaning. Example activations: trial signup plus first item created; teammate invited. This is how the next analysis starts smarter.

## Analytics loop

Use this closed-loop growth recipe for broad questions like where activation drops, what to fix next, or which experiment to run. It is guidance, not a rigid protocol.

1. Resolve auth and project; account-wide questions start with `projects`.

```bash
npx --yes @agent-analytics/cli@0.5.43 context get my-site
npx --yes @agent-analytics/cli@0.5.43 funnel my-site --steps-json '[{"event":"page_view"},{"event":"signup_completed"},{"event":"first_value"}]'
```

2. Read `context get <project>` and treat configured activation events as the activation source of truth. If activation is missing, ask for it or configure it; do not guess silently.
3. Discover reality with `properties <project>`, `properties-received <project>`, and recent `events <project>`.
4. Use `funnel` for ordered activation leakage, including population, window, step events, identity basis, strict survivors, largest absolute loss and largest relative loss. Prefer `--steps-json` when steps or labels need exactness.
5. Use `paths` for session-local entry, exit, detour, and drop-off behavior around the activation goal; do not present paths as long-cycle attribution.
6. Use `breakdown` around the largest leak by dimensions that exist: path, source, referrer, CTA label, device, browser, country, campaign, plan, surface, or onboarding step.
7. Use `events` or `journey` only for representative inspection or instrumentation sanity.
8. When `sessions <project>` marks a representative session with `▶ replay`, use `replays open --session <session_id> --project <project>` when visual behavior can explain a funnel/path finding. Treat replay as qualitative evidence for that session, never as aggregate proof. The command opens the newest playable segment and reports when more segments exist.
9. Use `retention` for cohorts, not blended active-user claims. Compare cohorts at the same age and note right-censored periods.
10. Read experiments against the business goal event, not exposure count. Decide keep/change/stop/complete with sample-size, causality, guardrail, and practical-significance caveats.
11. Recommend one narrow experiment by default. Recommend a readiness fix instead of an experiment when tracking, activation, sample, identity, or overlapping experiments block readout.

Funnel analyst behavior: name the population and conversion window, show counts and rates, identify the biggest driver, check segment/surface concentration, and avoid vague tracking advice.

Portfolio surface-role diagnosis: identify each project's role in the growth system, then read project-local metrics against that role. Do not reuse one activation definition across app, docs, directory, landing page, or lead-gen projects unless the user explicitly defines it.

## Subject erasure

`erase_subject` and `aa erase` delete one subject's data permanently. Run them only when the user explicitly asked to delete a specific person. Erasure needs manage or admin. A read session gets 403 `FORBIDDEN_SCOPE`. Subject erasure is never part of the default analytics loop. Do not call it from funnel, path, retention, experiment, vitals, compare, context, or growth-diagnosis work.

The call needs `confirm` set to the exact string `erase`, exactly one subject, and an idempotency key. The subject is one of `user_id`, `session_id`, or `email`. A missing confirm, two subjects, an empty subject, or a subject longer than 256 characters returns 400 `INVALID_ERASURE`. Pass `--idempotency-key`. If you omit it, the CLI generates a key and prints it. Keep that printed key and reuse it for a retry of the same erase. A different subject needs a new key. The same key with the same body returns the original job.

```bash
npx --yes @agent-analytics/cli@0.5.43 erase my-site --user-id <user_id> --confirm erase --idempotency-key <key>
```

`--session-id` or `--email` replaces `--user-id`. Pass exactly one.

Erasure needs manage or admin. That level grants the opt-in scope `erasures:write`. It is not in the default agent scopes. `analytics:read` and `projects:write` are not enough. MCP `erase_subject` is registered only when the session includes `erasures:write`, and it is not in the demo MCP. A read session gets 403 `FORBIDDEN_SCOPE`. Do not switch to MCP just to erase. The hourly cap is 20 accepts per account. Past that cap the call returns 429 `RATE_LIMITED` with reason `erasure_rate_limit`.

Report the receipt id and the counts back. The receipt id is `id` (`era_...`). `status` is `pending`, `running`, `completed`, or `failed`. Report `counts`: `events`, `sessions`, `identity_rows`, `profiles`, `email_lookups`, `replay_sessions`, and `replay_objects`. If `status` is not `completed`, say so and do not invent counts. Read the finished receipt with `erasures get <id>`. Do not repeat the raw subject (`user_id`, `session_id`, or `email`) in the report.

## Web Vitals

For any Web Vitals or page speed question, the first read is the vitals read. CLI: `vitals <project> [--days N] [--from] [--to] [--by device|path] [--limit N] [--json]`. MCP: `web_vitals`. API: `POST /vitals` (GET with the same query params is ok). Args: `project`, `days`, `date_from`, `date_to`, `group_by` (`device` or `path`), `limit` (default 10, max 20). The event is fixed to `page_view`. It is Pro and costs one read per call. A free account gets 403 `PRO_REQUIRED` and that blocked call is not metered. Do not start this question with `query`. A shipped-change before/after still uses free `compare`.

```bash
npx --yes @agent-analytics/cli@0.5.43 vitals my-site --days 7
npx --yes @agent-analytics/cli@0.5.43 vitals my-site --days 7 --by device
npx --yes @agent-analytics/cli@0.5.43 vitals my-site --days 7 --by path --limit 10
```

p75 is the headline (`percentile` is `p75`, `percentile_method` is `nearest_rank`). Report each metric as p75 with its unit, `rating`, `share`, and `n`. `skipped` counts page views in the group that lack that vital: no paint on that view, no interaction for INP, or an unsupported entry type. Report `n` and `skipped` as returned. Do not add a sample-size cutoff.

Rating uses the web.dev thresholds at <https://web.dev/articles/vitals>. A value <= `good_max` is `good`. A value > `poor_min` is `poor`. Otherwise the rating is `needs-improvement`. The same rule rates each load for `share` and rates the p75. `share` fractions run from 0 to 1 with 3 decimals, under `good`, `needs_improvement`, and `poor`.

| Metric | Key | Unit | good_max | poor_min |
| --- | --- | --- | --- | --- |
| LCP | `cwv_lcp` | ms | 2500 | 4000 |
| INP | `cwv_inp` | ms | 200 | 500 |
| CLS | `cwv_cls` | unitless | 0.1 | 0.25 |
| FCP | `cwv_fcp` | ms | 1800 | 3000 |
| TTFB | `cwv_ttfb` | ms | 800 | 1800 |

`cwv_pass` uses only LCP, INP, and CLS. It is true when those p75 ratings are all `good`. If INP `n` is 0, decide on LCP and CLS. It is null when LCP `n` is 0 or CLS `n` is 0.

`group_by` `device` (CLI `--by device`) returns `mobile`, `tablet`, and `desktop`. `group_by` `path` (CLI `--by path`) returns the top `limit` paths by `n`, sorted by worst LCP p75. With no group, `group` is null.

`top_poor_targets` lists up to 5 `{target, count}` selectors among poor loads. LCP, INP, and CLS use `cwv_lcp_target`, `cwv_inp_target`, and `cwv_cls_target`. A target is a CSS selector, at most 200 characters, with no text content and no URLs. FCP and TTFB return `[]`.

CLS is collected only in Chromium, where `layout-shift` is supported. The key is omitted otherwise, so unsupported browsers do not send a false zero. LCP and INP are also collected in Firefox and Safari. `cwv_ttfb` is `responseStart - max(activationStart, 0)` from navigation start, in ms. `perf_ttfb` under `data-track-performance` is a different field and stays unchanged.

Hosted stores `cwv_*` on `page_view`. Self-hosted core stores `$web_vitals`. Read hosted vitals from `page_view`. Default install snippets include `data-track-vitals="true"`. `data-track-vitals="false"` is explicit off. Every response includes boolean `approximate`. When `approximate` is true, say the read is approximate.

On hosted, a shipped LCP change uses `compare` with `--metric 'p75(cwv_lcp)' --metric-event page_view --better lower`.

## Numeric property metrics

Use `query` for a numeric property the fixed commands cannot aggregate. Web Vitals and page speed use the vitals read above. Metrics are `sum`, `avg`, `p50`, `p75`, and `p95`. `--property` is required with any of those metrics. The key must match `^[A-Za-z0-9_]+$` and be at most 128 characters. A missing property returns 400 `MISSING_FIELDS`. An invalid key returns 400 `INVALID_PROPERTY_KEY`. Only JSON numbers are aggregated. Numeric strings, booleans, nulls, and missing keys are skipped. Each row returns the metric you asked for, `n` (values used), and `skipped` (values ignored). `percentile_method` is `nearest_rank` when a percentile is requested and null for `sum` or `avg` only. Nearest-rank sorts ascending, breaks ties by event id, and picks rank `ceil(p/100 * n)`. Existing event filters, date ranges, filters, and `group_by` still apply. These aggregations are Pro, with the same gate as other `query` calls. A free account gets 403 `PRO_REQUIRED` and the blocked call is not metered. If the CLI returns `PRO_REQUIRED`, use the paid-tier handoff, then rerun the command.

Before this query, run `properties-received <project>` (MCP `properties_received`) and filter to the event that carries the key. That lookup is for custom properties. Hosted `cwv_*` keys live on `page_view`. Self-hosted core stores `$web_vitals`.

Revenue example. Record purchases as `aa.track('purchase', { revenue: 29, currency: 'USD' })`, then sum `revenue`. `29` and `USD` are the public example.

```bash
npx --yes @agent-analytics/cli@0.5.43 properties-received my-site
npx --yes @agent-analytics/cli@0.5.43 query my-site --metrics sum --property revenue --filter '[{"field":"event","op":"eq","value":"purchase"}]'
```

`group_by` may include `event`, `date`, `user_id`, `session_id`, and `country`, plus at most one `properties.<key>`. The key uses the same rule as a `properties.<key>` filter: `^[A-Za-z0-9_]+$` and at most 128 characters. Dots and hyphens are not allowed in the key. An invalid key returns 400 `INVALID_PROPERTY_KEY`. A second `properties.*` entry returns 400 `INVALID_GROUP_BY`. Each result row carries the value under the key exactly `properties.<key>`. A null or missing property groups as null. Metrics, filters, and date range still apply, including Pro numeric metrics. The row limit stays capped at 1,000. `query` stays Pro.

Count page views by path, and signups by day and path:

```bash
npx --yes @agent-analytics/cli@0.5.43 query my-site --metrics event_count,unique_users --group-by properties.path --filter '[{"field":"event","op":"eq","value":"page_view"}]'
npx --yes @agent-analytics/cli@0.5.43 query my-site --metrics event_count --group-by date,properties.path --filter '[{"field":"event","op":"eq","value":"signup_completed"}]'
```

MCP `query` takes `metrics`, `property`, `filters`, and `group_by`. `group_by` is an array of those strings, for example `["date", "properties.path"]`. `breakdown` (MCP `analytics_breakdown`) remains the short count of one property. Use `query` when you also need other metrics, filters, a date bucket, or another built-in group. Do not start broad growth diagnosis with `query`. Do not read a shipped change with `query`. Use `compare` for that read. `compare` with `metric` stays free.

## Read-only SQL

Prefer `query` and `analytics_breakdown` (CLI `breakdown`). Use MCP `run_sql` or CLI `aa sql` only when those cannot express the question, such as a join. API `POST /sql`. It is Pro. A free account gets 403 `PRO_REQUIRED` and that blocked call is not metered. `run_sql` is not registered on the demo MCP.

SQL covers a time window, so pass `days` or a date range. `days` defaults to 7 and maxes at 90. `date_from` and `date_to` are `YYYY-MM-DD`, and the span is at most 90 days. A bad window is 400 `INVALID_WINDOW`. The response `window` has `date_from` and `date_to`. The server applies the window, so rows outside it are not returned.

```bash
npx --yes @agent-analytics/cli@0.5.43 sql my-site --days 7 --sql 'SELECT e.date, s.entry_page, COUNT(*) AS n FROM events e JOIN sessions s ON s.session_id = e.session_id GROUP BY e.date, s.entry_page LIMIT 100'
npx --yes @agent-analytics/cli@0.5.43 sql my-site --from 2026-04-01 --to 2026-04-07 -f query.sql
```

Pass the statement with `--sql` or `-f`. CLI `--days` sets `days`. CLI `--from` and `--to` set `date_from` and `date_to`. v1 accepts one `SELECT`. A statement that starts with `WITH` is rejected. Each of `events` and `sessions` may be referenced at most once per statement. One `events`-`sessions` join is fine. A self-join is 400 `INVALID_SQL`. A `LIMIT` must be a plain integer. One query at a time per account. If one is already running, the call is 429 `SQL_BUSY` with `Retry-After`. A heavy read can return 429 `SQL_COOLDOWN` with `Retry-After`. On `SQL_BUSY`, `SQL_COOLDOWN`, or `SQL_UPSTREAM_RATE_LIMITED`, wait for `Retry-After` instead of retrying in a loop. The server exposes only this project's rows. `properties` is a JSON string. `resolved_user_id` is not a column. `events` has no `project_id` column. `sessions.project_id` is the project name.

- `events` columns: `id`, `event`, `properties`, `user_id`, `session_id`, `timestamp`, `date`, `country`
- `sessions` columns: `session_id`, `user_id`, `project_id`, `start_time`, `end_time`, `duration`, `entry_page`, `exit_page`, `event_count`, `is_bounce`, `date`

The response returns at most 1,000 rows. `truncated` is true when more rows matched.

## Change read

When you ship a change, such as a landing page edit, read it once on ship day + 8 or later. The command, a worked window, and the verdict rules are in `references/growth-recipes.md` under Change read recipe. Use `compare`. It is free on all plans and costs one read per call. The verdict is `keep`, `revert`, or `extend`, and it comes from the API. Report `verdict` and `reason`. Do not compute them yourself. On that same day, run `errors` with `new_since` set to the ship date. `errors` is the guardrail beside `compare`. It is Pro and costs one read per call.

1. Before shipping, write the rule down: goal event, denominator event, keep and revert thresholds as fractions, and the minimums. `0.15` = +15% relative lift. The absolute value of each threshold must be 5 or less. The denominator minimum is denominator unique users in each window. The goal count is unique converters: a user who fires the goal 3 times counts once. Each window reports `denominator_unique_users`, `goal_converters`, and `rate`. Record the baseline window and the compare window. The two windows use the same weekdays and exclude the ship day. With `--ship-date` and `--days 7`, `compare` reads 7 days before the ship day and 7 days after it. Keep the full rule with the schedule.
2. At ship time, record the ship with `annotate`. Annotation fields are only `occurred_at`, `title` (max 120 characters), and optional `note` (max 500 characters). Put a short copy of the rule in `note` when it fits. `annotate` adds one annotation. Do not use `context set` for the ship. `context set` replaces the whole context.
3. Schedule that one read in the host agent for ship day + 8 or later, so the compare window has no partial day and does not include today. A window that includes today returns `extend` with reason `incomplete_current_day`. A Grok Bot one-off dated routine is enough. Use a Claude or Codex scheduler when that host has one. Agent Analytics does not schedule or notify.
4. On that day, call `compare` once. Pass the written goal event, denominator event, ship date, threshold fractions, and minimums. CLI flags and MCP fields are in the change read recipe. `keep` applies when lift is at or above the keep threshold and the interval low is above 0. `revert` applies when lift is at or below the revert threshold and the 90% interval is entirely below zero. A noisy drop is `extend` with reason `inconclusive`. Other `extend` reasons are `zero_baseline` when the before rate is 0, `below_min_sample`, `zero_denominator`, `interval_includes_zero`, `no_evidence_of_gain`, and `incomplete_current_day`. If the reason is `incomplete_current_day`, read again on a later day. If the reason is `below_min_sample`, schedule one more `compare` with the same rule, again on a day when the compare window does not include today.
5. If the compare window may contain 404 or one-hit bot page views, for example right after sharing new URLs, rerun `compare` with `--exclude-denominator "properties.title=<404 page title>"` before trusting a revert. MCP `compare` sends that exclusion as `denominator_filters`: `[{"field":"properties.title","op":"neq","value":"<404 page title>"}]`. It applies only to the denominator.
6. Name any other annotation whose `occurred_at` falls in either window. Those are confounds. A shift in traffic source can confound the read as well. Before/after is not causal.
7. On a low-traffic site, prefer an upper-funnel rate: denominator event `page_view`, goal event a CTA click. Prefer that over a signup rate. Example defaults, not Agent Analytics policy: 200 denominator unique users per window, 20 goal converters across both windows, keep threshold `0.15` (+15% relative lift), revert threshold `-0.10` (-10% relative lift).
8. When the shipped change is about a numeric property, call the same free `compare` with `--metric` set to `sum(<prop>)`, `avg(<prop>)`, `p50(<prop>)`, `p75(<prop>)`, or `p95(<prop>)`. `--metric-event` is the event that carries the property. It defaults to the goal event. Set it when they differ. For hosted LCP, pass `--metric 'p75(cwv_lcp)' --metric-event page_view --better lower`. Hosted stores `cwv_*` on `page_view`. Self-hosted core stores `$web_vitals`, so `metric_event` is `$web_vitals` there. A vitals or page speed question that is not this before/after read uses `vitals` first. Revenue on the `purchase` event from `aa.track('purchase', { revenue: 29, currency: 'USD' })` uses `--metric 'sum(revenue)' --better higher` and can omit `--metric-event`. Default `better` is `higher`. Set `better` to `lower` for `cwv_lcp` and the other Web Vitals properties. The property name does not select the direction. `sum(<prop>)` is the sum per unique denominator user and sets `per_user` to true. `avg` and percentiles set `per_user` to false. v1 returns `interval` null and `interval_method` `"none"`. `lift` is `(compare value - baseline value) / baseline value`, negated when `better` is `lower`. `raw_lift` is that ratio before the negation. `--min-goal-events` counts `n` on `metric_event` across both windows (default 20), not unique converters. Below that minimum, or below `min_denominator` in either window, the verdict is `extend` with reason `below_min_sample`. When `lift` meets `keep_threshold` or `revert_threshold`, the verdict is `extend` with reason `no_interval_for_metric`. When `lift` is between the thresholds, the verdict is `extend` with reason `no_evidence_of_gain`. Report `lift`, `raw_lift`, and each window's `value`, `n`, and `skipped`. `no_interval_for_metric` is not a keep and it is not a revert. Leave `metric` unset to keep the conversion-rate rules in step 4. MCP `compare` fields are `metric`, `metric_event`, and `better`. Worked commands are in the change read recipe.
9. On that same day, run `errors <project> --since 7d --new-since <ship date>` beside `compare`. The MCP tool is `errors`. A free account gets 403 `PRO_REQUIRED` and that blocked call is not metered. A successful call is one metered read. `$error` stores `message`, `source`, `line`, and `col`, and it has no stack. The fingerprint is the SHA-256 of the normalized message, the source filename, and `line`. `new_since` is a `YYYY-MM-DD` date or annotation text. A date compares `first_seen` to that calendar date. An annotation compares `first_seen` to the annotation's full UTC timestamp. `first_seen` and `last_seen` use every stored `$error` for that fingerprint, not only the `--since` window. Zero annotation matches returns 400. More than one match returns 400 and lists `matches`. Every response includes boolean `approximate`. When `approximate` is true, it also includes `caps`, an array of entries from `distinct_triples` and `window_rows`. Say the counts are approximate and list `caps`. Report groups with `new_since` true next to `lift`, `raw_lift`, and the window values. They do not replace those numbers.

## Analytics answer contract

Lead with the decision, then prove it with the metric. For funnels, retention, paths, experiments, attribution, and audits, answer in this shape:

1. Best bet or diagnosis.
2. Metric definition: population, window, event names, identity basis, and conversion window.
3. Evidence: counts, rates, raw activity, strict survivors, movement, and biggest driver.
4. Segment, cohort, or surface where the issue is concentrated.
5. Caveat: identity, sample size, right-censored data, attribution, causality, or instrumentation limits.
6. One bounded next query or action.

Metric skepticism: Signup is not activation. Prefer retained activated users, revenue, payback, or durable value over signup volume. Funnels diagnose leakage but do not prove why users dropped. Do not call correlation causation without an experiment or causal design. Do not say an experiment won just because conversion moved up. Add the smallest event or property that unlocks the growth question.

Example:

```text
Best bet: fix activation setup friction.
Metric: app onboarding view -> setup copy -> signup -> project_created -> first_event_received within 7d.
Evidence: raw signup/project activity exists, but strict survivors collapse before first_event_received.
Caveat: cross-project identity only counts when portfolio membership and link-domain carrying are configured.
Next: split setup-copy users by selected runtime and first_event_received.
```

## Reference routing

Load references only when they are needed:

- `references/setup-auth.md`: login modes, access level, managed-runtime storage, paid-tier handoff, and safe command examples.
- `references/product-analytics-operating-model.md`: projects/surfaces/portfolios, consent-based instrumentation, context upkeep, and verification.
- `references/growth-recipes.md`: AARRR, Bullseye, AIDA, STP, JTBD, 4Ps, funnel/retention/experiment recipes, the change read recipe (including `metric`, hosted `metric_event page_view` for `cwv_lcp`, `better=lower`, `no_interval_for_metric`, and the `errors` guardrail), and copyable prompts. Web Vitals thresholds and `cwv_pass` are in the Web Vitals section above.

## Pitfalls

- Do not run `erase_subject` or `aa erase` unless the user explicitly asked to delete a specific person. The delete is permanent and is never part of the default analytics loop.
- A 404 on another project means the session is limited to its granted project.
- Do not use URL-only assumptions instead of code inspection when repo access exists.
- Do not create a project for every subdomain, localhost URL, staging URL, or preview.
- Do not install generic click/pageview duplicates for automatic tracker signals.
- Do not store temporary metrics, reports, PII, secrets, or git commit logs in context.
- Do not answer with raw-number dumps; use the analytics answer contract.
- Do not rank channels by signups alone, claim strict user conversion across projects without configured identity, or infer causality from correlation.
- Do not approximate paid-only reads if the user does not upgrade.
- Do not read a shipped change with `query`, `funnel`, or `insights`. Use `compare`. It is free on all plans and costs one read per call. For a numeric property, pass `metric` on that `compare`. For hosted `cwv_lcp`, pass `--metric-event page_view` and set `better` to `lower`. Self-hosted core stores `$web_vitals`. For any other vitals or page speed question, call `vitals` first. Report `lift`, `raw_lift`, and window `value`. Reason `no_interval_for_metric` is not a keep or a revert.
- Do not read hosted Web Vitals from `$web_vitals`. Hosted `cwv_*` keys are on `page_view`.
- Do not skip `errors` after a ship. Run `errors <project> --since 7d --new-since <ship date>` beside `compare`.
- Do not treat `vitals`, `query` numeric aggregations, or `errors` as free. They are Pro. `compare`, including `compare` with `metric`, stays free.
- Do not start with `run_sql` or `aa sql`. Prefer `query` and `analytics_breakdown`. Pass `days` or a date range. Each of `events` and `sessions` may be referenced at most once. A `LIMIT` must be a plain integer. One query at a time per account. On `SQL_BUSY`, `SQL_COOLDOWN`, or `SQL_UPSTREAM_RATE_LIMITED`, wait for `Retry-After` instead of retrying in a loop. SQL is Pro and returns at most 1,000 rows.

## Verification

Before finishing setup or analysis:

- Verify auth with `auth status` or `whoami` when relevant.
- Verify project identity and origins with `projects` or `project`.
- Verify the exact tracking snippet is installed for the user's project.
- Verify at least one first useful event with `events <project> --event <event_name> --days 7 --limit 20`.
- Verify context reads/writes preserve existing durable truth.
- Verify the final answer follows diagnosis, metric definition, evidence, segment/surface, caveat, and one bounded next action.
- After a shipped-change read, verify `compare` returned `verdict` and `reason`, and verify `errors` ran with `new_since` set to the ship date.
- For a vitals or page speed answer, verify it came from the vitals read and reports p75, `rating`, and `cwv_pass`.
