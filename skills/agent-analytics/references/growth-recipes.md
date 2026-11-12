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

Pass thresholds as fractions. `0.10` = +10% relative lift. `-0.10` = -10% relative lift. Relative lift is `(compare rate - baseline rate) / baseline rate`. Rate is goal events divided by denominator visitors in that window. You pass the fractions. The API applies them.

`compare` reads the 7 days before `--ship-date` and the 7 days after it. The ship day is excluded. One call reads both windows.

CLI flags: `--goal`, `--denominator`, `--ship-date`, `--keep`, `--revert`, `--min-visitors` (denominator visitors required in each window), `--min-goal-events` (goal events required across both windows).

MCP `compare` fields: `project`, `goal_event`, `denominator_event`, `ship_date`, `keep_threshold`, `revert_threshold`, `min_visitors`, `min_goal_events`.

At ship time, CLI `append-annotation` adds one annotation and leaves goals, activation events, glossary entries, and existing annotations in place. Flags: `--occurred-at`, `--title`, `--note`. MCP `append_annotation` fields: `project`, `occurred_at`, `title`, `note`. `note` is optional.

`funnel` and MCP `analytics_funnel` take `--since` / `since` and a conversion window in hours (`--window` / `conversion_window_hours`). They have no end date. `insights` and MCP `analytics_insights` take `--period` / `period`: `1d`, `7d`, `14d`, `30d`, `90d`. They cannot be anchored to the ship date. Do not use `query` for this read.

Worked window, ship day 2026-04-08 excluded. Baseline is 2026-04-01 through 2026-04-07. Compare is 2026-04-09 through 2026-04-15. Read on 2026-04-16, ship day + 8, so the compare window has no partial day. `page_view` and `landing_signup_cta_clicked` below are example event names.

```bash
npx --yes @agent-analytics/cli@0.5.37 append-annotation my-site --occurred-at 2026-04-08T00:00:00.000Z --title "Landing hero rewrite" --note "Host routine holds the rule. Goal landing_signup_cta_clicked / page_view. Windows 2026-04-01..2026-04-07 and 2026-04-09..2026-04-15. Example thresholds: keep 0.15, revert -0.10, 200 visitors per window, 20 goal events across both."
npx --yes @agent-analytics/cli@0.5.37 compare my-site --goal landing_signup_cta_clicked --denominator page_view --ship-date 2026-04-08 --keep 0.15 --revert -0.10 --min-visitors 200 --min-goal-events 20
```

On MCP `compare`, send `goal_event` `landing_signup_cta_clicked`, `denominator_event` `page_view`, `ship_date` `2026-04-08`, `keep_threshold` `0.15`, `revert_threshold` `-0.10`, `min_visitors` `200`, and `min_goal_events` `20`. Append the ship with MCP `append_annotation` and the same `occurred_at`, `title`, and `note`.

`context get <project>` returns every annotation. Analytics responses include annotations for the requested range plus one day before and after. Any other annotation with `occurred_at` inside either window is a confound. A shift in traffic source can confound the read as well. Before/after is not causal.

Example defaults, not Agent Analytics policy: 200 visitors per window, 20 goal events across both windows, keep at `0.15` (+15% relative lift), revert at `-0.10` (-10% relative lift).

## Copyable prompt

```text
Use Agent Analytics to diagnose where <project> loses users before activation. Start from project context, use configured activation events as source of truth, discover real events and properties, run funnel and paths, break down the largest leak, inspect representative journeys/events only if useful, then recommend one narrow experiment or the readiness fix that blocks readout. Use the pinned official CLI path and answer with diagnosis, metric definition, evidence, segment/surface, caveat, and one next action.
```
