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

Use this when the main skill's Change read section applies. `compare` is the read. It is free on all plans and costs one read per call. The response `verdict` is `keep`, `revert`, or `extend`. Do not compute the verdict from rates. Do not start a broad diagnosis with this command.

Pass thresholds as fractions on the nested `rule`. `0.15` = +15% relative lift. The absolute value of each threshold must be 5 or less. Relative lift is `(compare rate - baseline rate) / baseline rate`. Each window reports `denominator_unique_users`, `goal_converters`, and `rate`. Rate is `goal_converters` divided by `denominator_unique_users`. A user who fires the goal 3 times counts once. You pass the fractions. The API applies them.

`compare` with `--ship-date` reads `--days` before that date and `--days` after it. The ship day is excluded. `--days` is `window_days`: an integer multiple of 7, from 1 to 90. Omitted with `--ship-date`, it defaults to 7. Read on ship day + 8 or later so the compare window has no partial day. A window that includes today returns `verdict` `extend` and reason `incomplete_current_day`.

`--denominator` defaults to `page_view`. Do not put `event` in `--filter`. Pass `--goal` and `--denominator`.

CLI flags: `--goal`, `--denominator`, `--ship-date`, `--days`, `--keep-threshold`, `--revert-threshold`, `--min-denominator` (denominator unique users required in each window), `--min-goal-events` (goal converters required across both windows), `--filter`, `--json`.

`--keep-threshold`, `--revert-threshold`, `--min-denominator`, and `--min-goal-events` are sent as `rule.keep_threshold`, `rule.revert_threshold`, `rule.min_denominator`, and `rule.min_goal_events`. They are not top-level fields. There is no `min_visitors` field.

Or pass explicit windows and omit `--ship-date` and `--days`: `--baseline-from`, `--baseline-to`, `--compare-from`, `--compare-to`. Each window is `date_from` and `date_to`. Do not combine explicit windows with `--ship-date` or `--days`.

MCP `compare` fields: `project`, `goal_event`, optional `denominator_event` (default `page_view`), `filters`, and either `ship_date` plus `window_days` or `baseline` and `compare` windows (`date_from`, `date_to`). Optional nested `rule`: `keep_threshold`, `revert_threshold`, `min_denominator`, `min_goal_events`. Thresholds are not top-level.

At ship time, CLI `annotate` adds one annotation and leaves goals, activation events, glossary entries, and existing annotations in place. Flags: `--title` (max 120 characters), optional `--note` (max 500 characters), optional `--at` (ISO-8601 `occurred_at`; omitted, it defaults to now). MCP `append_project_annotation` fields: `project`, `occurred_at`, `title`, `note`. The same `occurred_at` and `title` returns `appended: false` and does not replace the stored note. The cap is 100 annotations.

`funnel` and MCP `analytics_funnel` take `--since` / `since` and a conversion window in hours (`--window` / `conversion_window_hours`). They have no end date. `insights` and MCP `analytics_insights` take `--period` / `period`: `1d`, `7d`, `14d`, `30d`, `90d`. They cannot be anchored to the ship date. Do not use `query` for this read.

Worked window, ship day 2026-04-08 excluded. Baseline is 2026-04-01 through 2026-04-07. Compare is 2026-04-09 through 2026-04-15. Read on 2026-04-16, ship day + 8, so the compare window has no partial day. `page_view` and `landing_signup_cta_clicked` below are example event names.

```bash
npx --yes @agent-analytics/cli@0.5.38 annotate my-site --title "Landing hero rewrite" --note "Host routine holds the rule. Goal landing_signup_cta_clicked / page_view. Windows 2026-04-01..2026-04-07 and 2026-04-09..2026-04-15. Example thresholds: keep 0.15, revert -0.10, 200 denominator unique users per window, 20 goal converters across both." --at 2026-04-08T00:00:00.000Z
npx --yes @agent-analytics/cli@0.5.38 compare my-site --ship-date 2026-04-08 --days 7 --goal landing_signup_cta_clicked --denominator page_view --keep-threshold 0.15 --revert-threshold -0.10 --min-denominator 200 --min-goal-events 20
```

Explicit windows for the same dates omit `--ship-date` and `--days`:

```bash
npx --yes @agent-analytics/cli@0.5.38 compare my-site --goal landing_signup_cta_clicked --baseline-from 2026-04-01 --baseline-to 2026-04-07 --compare-from 2026-04-09 --compare-to 2026-04-15 --keep-threshold 0.15 --revert-threshold -0.10 --min-denominator 200 --min-goal-events 20
```

On MCP `compare`, send `goal_event` `landing_signup_cta_clicked`, `denominator_event` `page_view`, `ship_date` `2026-04-08`, `window_days` `7`, and nested `rule` with `keep_threshold` `0.15`, `revert_threshold` `-0.10`, `min_denominator` `200`, and `min_goal_events` `20`. Append the ship with MCP `append_project_annotation` and the same `occurred_at`, `title`, and `note`.

`--json` prints the API body: `verdict`, `reason`, `lift`, a 90% interval, and `guardrails`. Report `verdict` and `reason`. Do not compute them.

- `extend` with reason `zero_baseline`: the before rate is 0.
- `revert`: lift is less than or equal to `revert_threshold`, and the 90% interval is entirely below zero.
- A noisy drop is `extend` with reason `inconclusive`: lift is at or below the revert threshold, but the interval is not entirely below zero.
- `keep`: lift is greater than or equal to `keep_threshold`, and the interval low is above 0.
- Other `extend` reasons: `below_min_sample`, `zero_denominator`, `interval_includes_zero`, `no_evidence_of_gain`, and `incomplete_current_day`.

`guardrails.annotations` and `guardrails.traffic_mix` are confounds. Before/after is not causal.

`context get <project>` returns every annotation. Analytics responses include annotations for the requested range plus one day before and after. Any other annotation with `occurred_at` inside either window is a confound.

Example defaults, not Agent Analytics policy: 200 denominator unique users per window, 20 goal converters across both windows, keep threshold `0.15` (+15% relative lift), revert threshold `-0.10` (-10% relative lift).

## Copyable prompt

```text
Use Agent Analytics to diagnose where <project> loses users before activation. Start from project context, use configured activation events as source of truth, discover real events and properties, run funnel and paths, break down the largest leak, inspect representative journeys/events only if useful, then recommend one narrow experiment or the readiness fix that blocks readout. Use the pinned official CLI path and answer with diagnosis, metric definition, evidence, segment/surface, caveat, and one next action.
```
