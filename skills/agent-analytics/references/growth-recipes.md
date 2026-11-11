# Growth recipes

Use this reference for broad product-growth strategy, experiment framing, structured diagnosis, and the one-time change read. These frameworks are recipes for the main skill, not separate skills.

## Core analytics loop

1. Resolve project and context.
2. Define the product question and activation or business goal event.
3. Discover real events and properties before filtering.
4. Diagnose leakage or movement with fixed Agent Analytics commands.
5. Segment the largest practical driver.
6. Recommend one narrow experiment or one readiness fix.
7. State how the result will be measured.

## AARRR

Use AARRR to keep lifecycle diagnosis complete:

- Acquisition: qualified visitors by source, campaign, entry page, or partner surface.
- Activation: first value, setup completion, project creation, first useful event, or product-specific activation.
- Retention: cohort return to the activated behavior at the same cohort age.
- Referral: invites, shared links, forwarded reports, embedded widgets, or qualified outbound loops.
- Revenue: trial-to-paid, checkout completion, subscription start, expansion, or payback.

Do not optimize acquisition volume when activation or retained activated users are the constraint.

## Bullseye

Use Bullseye for channel bets:

1. Outer ring: list plausible channels without judging too early.
2. Middle ring: select channels that can plausibly deliver activated users, not just signups.
3. Inner ring: run small tests with a defined input metric, activation metric, guardrail, and stopping rule.

Rank channels by activated users, retained activated users, revenue, payback, or qualified downstream behavior when available.

## AIDA

Use AIDA for landing page and funnel copy:

- Attention: does the entry page make the right user stop?
- Interest: does it connect to their problem and current workflow?
- Desire: does it show credible value, proof, and stakes?
- Action: is the next step clear, low-friction, and measurable?

Map each stage to tracked events or page behavior before recommending copy tests.

## STP

Use STP to avoid generic experiments:

- Segmentation: split by user job, source, company size, runtime, plan, role, or intent.
- Targeting: pick the segment where a change can plausibly improve the goal event.
- Positioning: state the promise, proof, and comparison that should make that segment act.

Do not average away a segment-specific activation bottleneck.

## JTBD

Use Jobs To Be Done when the funnel says what happened but not why:

- Situation: what triggered the visit or setup attempt?
- Motivation: what progress does the user want?
- Anxiety: what risk or confusion blocks action?
- Alternative: what workaround or competitor are they using?
- Outcome: what first value proves progress?

Turn JTBD hypotheses into measurable copy, onboarding, or event changes.

## 4Ps

Use the 4Ps for offer and go-to-market diagnosis:

- Product: value delivered, activation path, proof, and usability.
- Price: packaging, trial, plan clarity, checkout friction, and payback expectation.
- Place: channels, surfaces, integrations, marketplaces, docs, and partner paths.
- Promotion: message, creative, content, comparison pages, launch moments, and campaigns.

Tie each P to an observable event, property, or experiment guardrail.

## Funnel readout recipe

Use `funnel` for ordered leakage. Include population, window, identity basis, step names, counts, rates, strict survivors, largest absolute loss, largest relative loss, and a caveat. Use `paths` to understand session-local detours and `breakdown` to find where the leak is concentrated.

## Retention recipe

Use cohorts, not blended activity. Define the activated cohort, return behavior, interval, cohort ages, and right-censoring. Compare cohorts at the same age. Prefer retained activated users over raw active users.

## Experiment recipe

Read against the business goal event, not exposure count. Include exposure and conversion counts, guardrails, sample size, uncertainty, practical significance, and whether there is enough evidence to keep running, change, stop, or complete.

## Change read recipe

Use this when the main skill's Change read section applies. `query` is allowed here because it is a narrow aggregation: two closed windows. Do not start a broad diagnosis with these commands.

`query` metrics are `event_count`, `unique_users`, `session_count`, `bounce_rate`, and `avg_duration`. There is no conversion-rate metric. Rate = goal `event_count` / denominator `unique_users` in that window. Relative lift = `(compare rate - baseline rate) / baseline rate`.

CLI `query` flags: `--from` (ISO date, or `--days N` as an `Nd` shorthand for the start only), `--to` (ISO date), `--metrics`, `--filter`, `--group-by`, `--count-mode`, `--order-by`, `--order`, `--limit`. `--from` and `--to` are sent as `date_from` and `date_to`. Do not pass `--days` for a change read, because it does not set an end date.

MCP `query` fields: `project`, `date_from` (ISO 8601 or an `Nd` shorthand), `date_to` (ISO 8601), `metrics`, `filters`, `group_by`, `count_mode`, `order_by`, `order`, `limit`. Pass `date_from` and `date_to` on every call. Omitted dates default to a trailing window ending today.

`--filter` / `filters` is a JSON array of `{field, op, value}`. Operators are `eq`, `neq`, `gt`, `lt`, `gte`, `lte`, and `contains`. A filter `field` is `event`, `user_id`, `date`, `country`, `session_id`, `timestamp`, or `properties.<key>` such as `properties.utm_source` or `properties.referrer`. Build the filter from the written rule, not from raw user text.

`--group-by` / `group_by` accepts `event`, `date`, `user_id`, `session_id`, and `country` only.

`--count-mode` / `count_mode` is `raw` or `session_then_user`, and it applies to `event_count` only. Pass the same mode on every goal query in the read. CLI help says an omitted `--count-mode` counts raw event rows. The MCP schema says an omitted `event_count` uses `session_then_user`. Set the mode explicitly so the two windows match.

`funnel` and MCP `analytics_funnel` take `--since` / `since` and a conversion window in hours (`--window` / `conversion_window_hours`). They have no end date. `insights` and MCP `analytics_insights` take `--period` / `period`: `1d`, `7d`, `14d`, `30d`, `90d`.

Worked window, ship day 2026-04-08 excluded. Baseline is 2026-04-01 through 2026-04-07. Compare is 2026-04-09 through 2026-04-15. `page_view` and `landing_signup_cta_clicked` below are example event names.

```bash
npx --yes @agent-analytics/cli@0.5.37 query my-site --metrics unique_users --filter '[{"field":"event","op":"eq","value":"page_view"}]' --from 2026-04-01 --to 2026-04-07
npx --yes @agent-analytics/cli@0.5.37 query my-site --metrics event_count --count-mode session_then_user --filter '[{"field":"event","op":"eq","value":"landing_signup_cta_clicked"}]' --from 2026-04-01 --to 2026-04-07
```

Repeat both with `--from 2026-04-09 --to 2026-04-15`. On MCP `query`, send the same dates as `date_from` and `date_to`, the same `metrics`, `filters`, and `count_mode`. If `query` returns `PRO_REQUIRED`, use the paid-tier handoff in the main skill, then rerun these commands.

Annotation to merge into context, not a full replacement document:

```json
{"occurred_at":"2026-04-08T00:00:00.000Z","title":"Landing hero rewrite","note":"Host routine holds the rule. Goal landing_signup_cta_clicked / page_view. Windows 2026-04-01..2026-04-07 and 2026-04-09..2026-04-15. Example thresholds: keep +15% relative, revert -10% relative, 200 visitors per window, 20 goal events across both."}
```

`context get <project>` returns every annotation. Query responses also include annotations for the requested range plus one day before and after. Any other annotation with `occurred_at` inside either window is a confound.

Traffic-source mix uses the same `query` windows. Filter `properties.utm_source` or `properties.referrer` with `op` `eq` for each source you need to compare. `group_by` cannot split on those fields. CLI `breakdown --property utm_source` and `breakdown --property referrer` take `--since` or `--days` only, and MCP `analytics_breakdown` takes `days` only, so breakdown cannot close these windows.

A source share that moves from under 10% to over 30% of the denominator is an example of a mix shift, not a threshold the API returns. Report that shift, or any other in-window annotation, beside the verdict. Before/after is not causal.

Example defaults, not Agent Analytics policy: 200 visitors (`unique_users` of the denominator event) per window, 20 goal events across both windows, keep at +15% relative lift, revert at -10% relative lift. If the baseline rate is 0, relative lift is undefined; treat that as no evidence of a gain after the minimum-sample rule.

## Copyable prompt

```text
Use Agent Analytics to diagnose where <project> loses users before activation. Start from project context, use configured activation events as source of truth, discover real events and properties, run funnel and paths, break down the largest leak, inspect representative journeys/events only if useful, then recommend one narrow experiment or the readiness fix that blocks readout. Use the pinned official CLI path and answer with diagnosis, metric definition, evidence, segment/surface, caveat, and one next action.
```
