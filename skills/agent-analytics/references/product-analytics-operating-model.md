# Product analytics operating model

Use this reference when setup, instrumentation, project context, or cross-project scope needs more detail.

## Projects, surfaces, and portfolios

- Project: unit of local product learning. It owns events, activation, retention, lifecycle, releases, experiments, goals, and context.
- Surface: a place users encounter or use that project, such as app, docs, blog, pricing, signup, onboarding, subdomain, mobile client, local preview, or deploy preview.
- Portfolio: related projects in one growth system. It supports shared goals, roles, milestones, and configured cross-project identity without collapsing project-local truth.

Subdomains are usually surfaces. Localhost, staging, and previews are setup or QA surfaces. Separate products that need separate activation, lifecycle, or experiments should be separate projects under one portfolio.

Customers define their own project and portfolio goals. Agents can propose goals from the repo and workflow context, but initial durable goals should be confirmed before storing them. Later goal or context updates can follow the user's working agreement with their agent.

## Consent-based instrumentation

Install only for projects the user owns or manages. Treat the base snippet as the start of instrumentation, not the full plan.

Minimum workflow:

1. Classify scope.
2. Ask for or propose the initial project/portfolio goal and get confirmation before storing it as durable context.
3. Inspect product code when available.
4. Login and create or identify the right project. When the project exists, name it: `login --project <name> --level read`. Request the lowest level that fits. Read is the default. Request manage only when the user asked to change data or erase someone. When the account has no project yet, or the user asks to create one, log in with `--level admin` and no `--project` (All projects), run create, then use read or manage for normal work. Creating a project needs admin with All projects. Context, annotations, experiments, feedback and replay writes need manage. A 404 on another project means the session is limited to its granted project.
5. Add the exact tracking snippet returned for that project.
6. Choose the smallest meaningful custom event set tied to the confirmed goal.
7. Explain what each event enables.
8. Verify the first useful event.

Good event candidates: named CTA clicks, signup intent, pricing interactions, checkout progress or completion, install/setup steps, activation milestones, and durable server-side outcomes such as signup, subscription, project creation, installation completion, or first useful product action.

Use `data-aa-event` for named click intent, `data-aa-impression` for meaningful section exposure, `window.aa.track(...)` for computed client state, server-side tracking for durable outcomes, and identify/set calls after auth. Enable scroll depth, forms, downloads, errors, performance, or SPA tracking only when tied to a concrete decision. Default install snippets include `data-track-vitals="true"`. `data-track-vitals="false"` is explicit off.

When the question is Web Vitals or page speed, the first read is the vitals read: CLI `vitals`, MCP `web_vitals`, API `POST /vitals`. It is Pro. p75 is the headline. Hosted stores `cwv_*` on `page_view`. Self-hosted core stores `$web_vitals`. `cwv_pass` is true when LCP, INP, and CLS p75 are all `good`. If INP `n` is 0, decide on LCP and CLS. It is null when LCP or CLS `n` is 0. Rating: a value <= `good_max` is `good`, a value > `poor_min` is `poor`, otherwise `needs-improvement`. Thresholds (<https://web.dev/articles/vitals>): LCP 2500/4000 ms, INP 200/500 ms, CLS 0.1/0.25 unitless, FCP 1800/3000 ms, TTFB 800/1800 ms. `--by device` returns `mobile`, `tablet`, and `desktop`. `--by path` returns the top paths by `n`, sorted by worst LCP p75. `top_poor_targets` lists up to 5 selectors among poor loads for LCP, INP, and CLS (`cwv_lcp_target`, `cwv_inp_target`, `cwv_cls_target`). FCP and TTFB return `[]`. CLS is Chromium only. `skipped` counts page views missing that vital. Record revenue as `aa.track('purchase', { revenue: 29, currency: 'USD' })` and aggregate `revenue` with `sum`. `29` and `USD` are the public example. After a ship, run free `compare` with `metric` `p75(cwv_lcp)`, `metric_event` `page_view` on hosted, and `better=lower`. Report `lift`, `raw_lift`, and window `value`. v1 returns `extend` with reason `no_interval_for_metric` when a threshold is met. Also run Pro `errors` with `new_since` set to the ship date. The group fingerprint is normalized message, source filename, and `line`. `$error` has no stack.

Do not duplicate automatic signals: page views, path, referrer, UTM fields, device/browser, country, sessions, first-touch attribution, or days since first visit.

## Context upkeep

Read context before project-specific analysis. Write context only when durable product truth changed.

Save:

- goals
- activation events
- event-name glossary entries tied to real `event_name` values
- sparse annotations for major landing page, pricing, onboarding, feature, release, or experiment changes

Skip:

- weekly metric values
- temporary spikes
- pasted reports
- raw autoresearch round notes
- PII or secrets
- long notes
- git commit logs
- unsupported guesses

`context set` replaces context; read first, merge carefully, and keep valid entries. Do not invent fields outside goals, activation_events, glossary, and annotations.

## Cross-project identity

For identity-aware reads across related projects, configure both browser and server sides:

- tracker `data-link-domains` so anonymous IDs can move through links
- portfolio membership with `portfolios create` or `portfolios update`

Either side alone is incomplete. Do not claim strict user conversion across projects unless both are configured and the metric definition says so.

## Verification checklist

- Auth is valid.
- Project and allowed origins match the intended product and surface.
- Snippet belongs to the user's project.
- First useful event arrived.
- Context remains compact and durable.
- Final analysis includes decision, metric definition, evidence, caveat, and next action.
