import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const skill = readFileSync(join(root, 'skills/agent-analytics/SKILL.md'), 'utf8');
const autoresearchSkill = readFileSync(join(root, 'skills/agent-analytics-autoresearch/SKILL.md'), 'utf8');
const autoresearchBriefTemplate = readFileSync(
  join(root, 'skills/agent-analytics-autoresearch/references/brief-template.md'),
  'utf8',
);
const autoresearchSnapshotScript = readFileSync(
  join(root, 'skills/agent-analytics-autoresearch/scripts/collect_agent_analytics_snapshot.sh'),
  'utf8',
);
const autoresearchInitScript = readFileSync(
  join(root, 'skills/agent-analytics-autoresearch/scripts/init_autoresearch_run.sh'),
  'utf8',
);
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const growthRecipes = readFileSync(
  join(root, 'skills/agent-analytics/references/growth-recipes.md'),
  'utf8',
);
const setupAuth = readFileSync(
  join(root, 'skills/agent-analytics/references/setup-auth.md'),
  'utf8',
);
const operatingModel = readFileSync(
  join(root, 'skills/agent-analytics/references/product-analytics-operating-model.md'),
  'utf8',
);

describe('agent-analytics skill contract', () => {
  it('pins the official CLI to 0.5.41 everywhere', () => {
    assert.match(skill, /version: 4\.0\.40/);
    assert.ok(skill.includes('npx --yes @agent-analytics/cli@0.5.41'));
    assert.ok(readme.includes('npx --yes @agent-analytics/cli@0.5.41'));
    assert.match(autoresearchSkill, /version: 1\.0\.13/);
    assert.ok(autoresearchSkill.includes('npx --yes @agent-analytics/cli@0.5.41'));
    assert.ok(autoresearchBriefTemplate.includes('npx --yes @agent-analytics/cli@0.5.41'));
    assert.ok(autoresearchSnapshotScript.includes('npx --yes @agent-analytics/cli@0.5.41'));
    assert.ok(growthRecipes.includes('npx --yes @agent-analytics/cli@0.5.41'));
    assert.ok(setupAuth.includes('npx --yes @agent-analytics/cli@0.5.41'));
    for (const content of [
      skill,
      readme,
      autoresearchSkill,
      autoresearchBriefTemplate,
      autoresearchSnapshotScript,
      growthRecipes,
      setupAuth,
    ]) {
      assert.doesNotMatch(content, /@agent-analytics\/cli@0\.5\.25/);
      assert.doesNotMatch(content, /@agent-analytics\/cli@0\.5\.39/);
      assert.doesNotMatch(content, /@agent-analytics\/cli@0\.5\.40/);
    }
    assert.equal(/@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(skill), false);
    assert.equal(/@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(readme), false);
    assert.equal(
      /@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(autoresearchSkill),
      false,
    );
    assert.equal(
      /@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(autoresearchBriefTemplate),
      false,
    );
    assert.equal(
      /@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(autoresearchSnapshotScript),
      false,
    );
  });

  it('documents the paid upgrade handoff without raw API-key fallback', () => {
    assert.match(skill, /Paid-tier handoff/i);
    assert.match(skill, /PRO_REQUIRED/i);
    assert.match(skill, /upgrade-link --detached/i);
    assert.match(skill, /upgrade-link --wait/i);
    assert.match(skill, /dashboard page first/i);
    assert.match(skill, /confirms the same account as the CLI/i);
    assert.match(skill, /full retry command and private analysis context in the agent session/i);
    assert.doesNotMatch(skill, /upgrade-link[^`\n]*--command/);
    assert.match(readme, /confirms the same account as the CLI/i);
    assert.match(skill, /whoami/i);
    assert.equal(/login --token/i.test(skill), false);
    assert.equal(/login --token/i.test(readme), false);
  });

  it('requires consent-based project-owned setup before installing events', () => {
    assert.match(skill, /Consent-based tracker setup policy/i);
    assert.match(skill, /project-owned workflow/i);
    assert.match(skill, /do not guess/i);
    assert.match(skill, /do not overtrack/i);
    assert.match(skill, /do not install generic events/i);
    assert.match(skill, /create <project> --domain <origin>/i);
    assert.match(skill, /exact tracking snippet/i);
    assert.match(skill, /base tracker snippet as the start of instrumentation/i);
    assert.match(skill, /not the full instrumentation plan/i);
    assert.match(skill, /smallest named set of meaningful events and tracker opt-ins/i);
    assert.match(skill, /meaningful custom events/i);
    assert.match(readme, /project-owned tracker/i);
    assert.match(readme, /meaningful custom events/i);
    assert.match(readme, /start of instrumentation, not the full instrumentation plan/i);
    assert.doesNotMatch(skill, /paste (?:the )?snippet and stop/i);
    assert.doesNotMatch(skill, /copy (?:the )?snippet and stop/i);
    assert.doesNotMatch(readme, /paste (?:the )?snippet and stop/i);
    assert.doesNotMatch(readme, /copy (?:the )?snippet and stop/i);
    assert.doesNotMatch(readme, /scan <url> --project <project> --json/i);
    assert.doesNotMatch(readme, /website-analysis preview/i);
  });

  it('keeps local runtimes on browser login and detached as the fallback path', () => {
    assert.match(skill, /Claude Code, Codex, Cursor, and local CLI runtimes/i);
    assert.match(skill, /npx --yes @agent-analytics\/cli@0\.5\.41 login/i);
    assert.match(skill, /do not choose detached login just because/i);
    assert.match(skill, /Paperclip, OpenClaw, and other issue-based runtimes/i);
    assert.match(skill, /finish code/i);
    assert.match(readme, /normal browser approval first/i);
    assert.match(readme, /Use `login --detached` only for Paperclip, OpenClaw, issue-based or headless runtimes/i);
  });

  it('documents persistent OpenClaw auth storage', () => {
    assert.match(skill, /AGENT_ANALYTICS_CONFIG_DIR/i);
    assert.match(skill, /\.openclaw\/agent-analytics/i);
    assert.match(skill, /auth status/i);
    assert.match(skill, /--config-dir/i);
    assert.match(skill, /Never commit .*config\.json/i);
  });

  it('uses meaningful event verification language', () => {
    assert.match(skill, /exact tracking snippet/i);
    assert.match(skill, /first useful event/i);
    assert.match(skill, /events <project>/i);
    assert.match(skill, /what the installed events now let the user's agent answer/i);
    assert.match(readme, /verify the first useful event/i);
  });

  it('maps analysis recommendations to tracker capabilities instead of duplicate generic events', () => {
    assert.match(skill, /data-aa-event/i);
    assert.match(skill, /data-aa-impression/i);
    assert.match(skill, /window\.aa\.track/i);
    assert.match(skill, /server-side tracking/i);
    assert.match(skill, /named CTA clicks/i);
    assert.match(skill, /signup intent/i);
    assert.match(skill, /pricing interactions/i);
    assert.match(skill, /checkout progress or completion/i);
    assert.match(skill, /install\/setup steps/i);
    assert.match(skill, /activation milestones/i);
    assert.match(skill, /durable server-side outcome events/i);
    assert.match(skill, /scroll depth/i);
    assert.match(skill, /form tracking/i);
    assert.match(skill, /downloads/i);
    assert.match(skill, /data-track-vitals="true"/);
    assert.match(skill, /scroll depth, form tracking, downloads, errors, performance, and SPA tracking/i);
    assert.match(skill, /SPA tracking/i);
    assert.match(skill, /do not add duplicate custom events/i);
    assert.match(readme, /automatic tracker signals/i);
    assert.match(readme, /named CTAs, signup intent, pricing interactions, checkout steps, install\/setup progress, activation milestones/i);
    assert.match(readme, /scroll depth, forms, downloads, errors, performance, and SPA tracking/i);
    assert.match(readme, /data-track-vitals="true"/);
  });

  it('frames copied handoff as a consented instrumentation task, not a generic prompt', () => {
    assert.match(skill, /Set up Agent Analytics for this project/i);
    assert.match(skill, /browser callback cannot resume/i);
    assert.match(skill, /project-owned tracker/i);
    assert.match(skill, /meaningful custom events/i);
    assert.match(skill, /explain what each event enables/i);
    assert.match(readme, /browser callback cannot resume/i);
    assert.match(readme, /project-owned tracker/i);
  });

  it('teaches compact project context and event-name glossary upkeep', () => {
    assert.match(skill, /context get/i);
    assert.match(skill, /context set/i);
    assert.match(skill, /project_context/i);
    assert.match(skill, /properties <project>/i);
    assert.match(skill, /properties-received <project>/i);
    assert.match(skill, /event_name/i);
    assert.match(skill, /Keep .*short/i);
    assert.match(skill, /self-improving memory/i);
    assert.match(skill, /At the start of any project-specific analysis/i);
    assert.match(skill, /context set.*replaces the stored context/i);
    assert.match(skill, /Always read the existing context first/i);
    assert.match(skill, /Save durable product truth/i);
    assert.match(skill, /Skip noisy findings/i);
    assert.match(skill, /annotations/i);
    assert.match(skill, /major product changes/i);
    assert.match(skill, /landing page, pricing, onboarding, feature, release, or experiment/i);
    assert.match(skill, /do not store git commit logs/i);
    assert.match(skill, /512KB/i);
    assert.match(skill, /max 100/i);
    assert.match(skill, /requested analytics date range plus one day/i);
    assert.match(skill, /Do not invent unsupported fields/i);
    assert.match(skill, /multi-project or multi-domain/i);
    assert.match(skill, /identity portfolio/i);
    assert.match(skill, /portfolios create/i);
    assert.match(skill, /portfolios update/i);
    assert.match(skill, /portfolios list/i);
    assert.match(skill, /privacy-first email lookup/i);
    assert.doesNotMatch(skill, /portfolio-context get/i);
    assert.doesNotMatch(skill, /surface_roles/i);
    assert.match(skill, /data-link-domains/i);
    assert.match(skill, /cross-project identity stitching/i);
    assert.match(skill, /decorates links but does not make separate projects share identity/i);
    assert.match(skill, /server-side portfolio scope/i);
    assert.match(readme, /cross-project identity stitching/i);
    assert.match(readme, /data-link-domains.*portfolios create\/update/i);
    assert.doesNotMatch(readme, /surface_roles/i);
    assert.match(readme, /date annotations/i);
    assert.match(skill, /trial signup plus first item created/i);
    assert.match(skill, /teammate invited/i);
    assert.match(skill, /next analysis starts smarter/i);
  });

  it('teaches analytics-oriented funnel diagnosis instead of raw-number dumps', () => {
    assert.match(skill, /Analytics answer contract/i);
    assert.match(skill, /Lead with the decision, then prove it with the metric/i);
    assert.match(skill, /Best bet or diagnosis/i);
    assert.match(skill, /Metric definition/i);
    assert.match(skill, /strict survivors/i);
    assert.match(skill, /Signup is not activation/i);
    assert.match(skill, /retained activated users/i);
    assert.match(skill, /right-censored/i);
    assert.match(skill, /smallest event or property that unlocks the growth question/i);
    assert.match(skill, /Funnel analyst behavior/i);
    assert.match(skill, /context get my-site/i);
    assert.match(skill, /--steps-json/i);
    assert.match(skill, /largest absolute loss and largest relative loss/i);
    assert.match(skill, /data-link-domains/i);
    assert.match(skill, /do not claim strict user conversion across projects/i);
    assert.match(skill, /Portfolio surface-role diagnosis/i);
    assert.doesNotMatch(skill, /generic "track more events"/i);
  });

  it('teaches a closed-loop growth recipe over fixed product-growth commands', () => {
    assert.match(skill, /Closed-loop growth recipe/i);
    assert.match(skill, /guidance, not a rigid protocol/i);
    assert.match(skill, /context get <project>/i);
    assert.match(skill, /activation source of truth/i);
    assert.match(skill, /If activation is missing, ask for it or configure it; do not guess silently/i);
    assert.match(skill, /properties <project>/i);
    assert.match(skill, /properties-received <project>/i);
    assert.match(skill, /events <project>/i);
    assert.match(skill, /Do not start broad growth diagnosis with `query`/i);
    assert.match(skill, /Use `query` only for narrow aggregations/i);
    assert.match(skill, /Use `funnel` for ordered activation leakage/i);
    assert.match(skill, /Use `paths` for session-local entry, exit, detour, and drop-off behavior/i);
    assert.match(skill, /Use `breakdown` around the largest leak/i);
    assert.match(skill, /Use `events` or `journey` only for representative inspection/i);
    assert.match(skill, /Recommend one narrow experiment by default/i);
    assert.match(skill, /Recommend a readiness fix instead of an experiment/i);
    assert.match(skill, /Read experiments against the business goal event, not exposure count/i);
    assert.match(skill, /diagnosis, metric definition, evidence, segment\/surface, caveat, and one bounded next action/i);
    assert.match(skill, /There is no `report` command in CLI `0\.5\.41`/i);
    assert.match(skill, /Produce the final report yourself from fixed-command outputs/i);
    assert.doesNotMatch(skill, /Start with .*`report`/i);
    assert.doesNotMatch(skill, /npx --yes @agent-analytics\/cli@0\.5\.41 report/i);
    assert.match(skill, /npx --yes @agent-analytics\/cli@0\.5\.41/);
    assert.doesNotMatch(skill, /raw SQL|POST \/aaql\/query|\/aaql\/plan|\/aaql\/execute/i);
  });

  it('teaches agents to classify project surface and portfolio scope before action', () => {
    assert.match(skill, /Classification before action/i);
    assert.match(skill, /project-first and portfolio-aware/i);
    assert.match(skill, /project is the unit of local product learning/i);
    assert.match(skill, /One project can include many surfaces/i);
    assert.match(skill, /portfolio is the cross-project growth system for related projects/i);
    assert.match(skill, /intentionally grouped portfolio projects/i);
    assert.match(skill, /Subdomains are usually surfaces/i);
    assert.match(skill, /mobile app is a surface/i);
    assert.match(skill, /free tool is a surface/i);
    assert.match(skill, /Localhost.*setup or QA surfaces/i);
    assert.match(skill, /Separate products.*separate projects under one portfolio/i);
    assert.match(skill, /do not treat it as immediate failure/i);
    assert.match(skill, /Clarify which project and surface/i);
    assert.match(skill, /Project-local setup or analysis/i);
    assert.match(skill, /Related-project grouping/i);
    assert.match(skill, /Shared goals, roles, and milestones/i);
    assert.match(skill, /guides\/projects-surfaces-portfolios/i);
    assert.doesNotMatch(skill, /Portfolio\s*(?:→|->)\s*Projects\s*(?:→|->)\s*Surfaces/i);
    assert.match(readme, /classify whether work belongs to a project, a surface inside a project, or a related-project portfolio/i);
    assert.match(readme, /guides\/projects-surfaces-portfolios/i);
  });

  it('teaches a one-time change read with free compare', () => {
    assert.match(skill, /^author: dannyshmueli$/m);
    assert.match(skill, /## Change read/);
    assert.match(skill, /references\/growth-recipes\.md/);
    assert.match(skill, /Change read recipe/);
    assert.match(skill, /ship day \+ 8/);
    assert.match(skill, /free on all plans/);
    assert.match(skill, /one read per call/);
    assert.match(skill, /`keep`, `revert`, or `extend`/);
    assert.match(skill, /it comes from the API/);
    assert.match(skill, /Do not compute them yourself/);
    assert.match(skill, /`0\.15` = \+15% relative lift/);
    assert.match(skill, /absolute value of each threshold must be 5 or less/);
    assert.match(skill, /ship day \+ 8 or later/);
    assert.match(skill, /includes today/);
    assert.match(skill, /incomplete_current_day/);
    assert.match(skill, /unique converters/);
    assert.match(skill, /fires the goal 3 times counts once/);
    assert.match(skill, /denominator_unique_users/);
    assert.match(skill, /goal_converters/);
    assert.match(skill, /entirely below zero/);
    assert.match(skill, /inconclusive/);
    assert.match(skill, /interval low is above 0/);
    assert.match(skill, /zero_baseline/);
    assert.match(skill, /below_min_sample/);
    assert.match(skill, /zero_denominator/);
    assert.match(skill, /interval_includes_zero/);
    assert.match(skill, /no_evidence_of_gain/);
    assert.match(skill, /`annotate`/);
    assert.match(skill, /append_project_annotation/);
    assert.match(skill, /denominator unique users/);
    assert.match(skill, /`context set` replaces the whole context/);
    assert.match(skill, /Do not use `context set` for the ship/);
    assert.match(skill, /occurred_at/);
    assert.match(skill, /no partial day/);
    assert.match(skill, /Agent Analytics does not schedule or notify/);
    assert.match(skill, /Grok Bot one-off dated routine/);
    assert.match(skill, /Claude or Codex scheduler/);
    assert.match(skill, /Before\/after is not causal/);
    assert.match(skill, /page_view/);
    assert.match(skill, /200 denominator unique users per window/);
    assert.match(skill, /20 goal converters across both windows/);
    assert.match(skill, /keep threshold `0\.15` \(\+15% relative lift\)/);
    assert.match(skill, /revert threshold `-0\.10` \(-10% relative lift\)/);
    assert.doesNotMatch(skill, /revert at `-0\.10`|10% drop alone|drop alone means revert/);
    assert.match(skill, /Example defaults, not Agent Analytics policy/);
    assert.match(skill, /the change read recipe/);
    assert.match(skill, /The shipped-change read is `compare`/);
    assert.match(skill, /--exclude-denominator "properties\.title=<404 page title>"/);
    assert.match(skill, /before trusting a revert/);
    assert.match(skill, /404 or one-hit bot page views/);
    assert.match(skill, /denominator_filters/);
    assert.match(skill, /"op":"neq"/);
    assert.match(skill, /`compare`, `annotate`/);
    assert.doesNotMatch(skill, /append-annotation|append_annotation|min_visitors|--min-visitors/);
    assert.doesNotMatch(skill, /--date-from|--date-to|--until/);
    assert.doesNotMatch(skill, /Use `query` with `--from` and `--to`/);
    assert.doesNotMatch(skill, /about 7 days later/);
    assert.doesNotMatch(skill, /needs Pro/i);

    assert.match(growthRecipes, /## Change read recipe/);
    assert.match(growthRecipes, /free on all plans/);
    assert.match(growthRecipes, /one read per call/);
    assert.match(growthRecipes, /`0\.15` = \+15% relative lift/);
    assert.match(growthRecipes, /absolute value of each threshold must be 5 or less/);
    assert.match(growthRecipes, /goal_converters/);
    assert.match(growthRecipes, /denominator_unique_users/);
    assert.match(growthRecipes, /fires the goal 3 times counts once/);
    assert.match(growthRecipes, /includes today/);
    assert.match(growthRecipes, /incomplete_current_day/);
    assert.match(growthRecipes, /zero_baseline/);
    assert.match(growthRecipes, /entirely below zero/);
    assert.match(growthRecipes, /inconclusive/);
    assert.match(growthRecipes, /interval low is above 0/);
    assert.match(growthRecipes, /below_min_sample/);
    assert.match(growthRecipes, /zero_denominator/);
    assert.match(growthRecipes, /interval_includes_zero/);
    assert.match(growthRecipes, /no_evidence_of_gain/);
    assert.match(growthRecipes, /20 goal converters across both windows/);
    assert.doesNotMatch(growthRecipes, /revert at `-0\.10`|10% drop alone|drop alone means revert|goal_event_count/);
    assert.match(growthRecipes, /npx --yes @agent-analytics\/cli@0\.5\.41 annotate my-site/);
    assert.match(growthRecipes, /npx --yes @agent-analytics\/cli@0\.5\.41 compare my-site/);
    assert.match(growthRecipes, /--ship-date 2026-04-08 --days 7/);
    assert.match(growthRecipes, /--keep-threshold 0\.15/);
    assert.match(growthRecipes, /--revert-threshold -0\.10/);
    assert.match(growthRecipes, /--min-denominator 200/);
    assert.match(growthRecipes, /--min-goal-events 20/);
    assert.match(growthRecipes, /--goal landing_signup_cta_clicked/);
    assert.match(growthRecipes, /--denominator page_view/);
    assert.match(growthRecipes, /--at 2026-04-08T00:00:00\.000Z/);
    assert.match(growthRecipes, /--baseline-from 2026-04-01 --baseline-to 2026-04-07/);
    assert.match(growthRecipes, /--compare-from 2026-04-09 --compare-to 2026-04-15/);
    assert.match(growthRecipes, /2026-04-16/);
    assert.match(growthRecipes, /ship day \+ 8/);
    assert.match(growthRecipes, /no partial day/);
    assert.match(growthRecipes, /window_days/);
    assert.match(growthRecipes, /rule\.keep_threshold/);
    assert.match(growthRecipes, /rule\.revert_threshold/);
    assert.match(growthRecipes, /rule\.min_denominator/);
    assert.match(growthRecipes, /append_project_annotation/);
    assert.match(growthRecipes, /denominator unique users/);
    assert.match(growthRecipes, /There is no `min_visitors` field/);
    assert.match(growthRecipes, /--exclude-denominator "properties\.title=<404 page title>"/);
    assert.match(growthRecipes, /denominator_filters/);
    assert.match(growthRecipes, /applies only to denominator events/);
    assert.match(growthRecipes, /before trusting a revert/);
    assert.doesNotMatch(growthRecipes, /append-annotation|append_annotation|--min-visitors|--occurred-at|--keep 0\.15|--revert -0\.10/);
    assert.match(growthRecipes, /verdict` is `keep`, `revert`, or `extend`/);
    assert.match(growthRecipes, /Do not compute the verdict from rates/);
    assert.match(growthRecipes, /Do not use `query` for this read/);
    assert.match(growthRecipes, /analytics_funnel/);
    assert.match(growthRecipes, /analytics_insights/);
    assert.match(growthRecipes, /conversion_window_hours/);
    assert.match(growthRecipes, /Example defaults, not Agent Analytics policy/);
    assert.match(growthRecipes, /Before\/after is not causal/);
    assert.doesNotMatch(growthRecipes, /@agent-analytics\/cli@0\.5\.41 query/);
    assert.doesNotMatch(growthRecipes, /--from 2026-04-01|--to 2026-04-07|--from 2026-04-09|--to 2026-04-15/);
    assert.doesNotMatch(growthRecipes, /PRO_REQUIRED/);
    assert.doesNotMatch(growthRecipes, /needs Pro/i);
    assert.doesNotMatch(growthRecipes, /--date-from|--date-to|--until|dateTo|dateFrom/);
  });

  it('teaches Autoresearch to use project context as self-improving product memory', () => {
    assert.match(autoresearchSkill, /context get <project>/i);
    assert.match(autoresearchSkill, /project_context/i);
    assert.match(autoresearchSkill, /self-improving product memory/i);
    assert.match(autoresearchSkill, /durable product truth/i);
    assert.match(autoresearchSkill, /skip weekly numbers/i);
    assert.match(autoresearchSkill, /Do not store raw round notes/i);
    assert.match(autoresearchSkill, /references\/results-header\.txt/i);
    assert.doesNotMatch(autoresearchSkill, /references\/results-header\.tsv/i);
    assert.match(autoresearchInitScript, /references\/results-header\.txt/i);
    assert.doesNotMatch(autoresearchInitScript, /references\/results-header\.tsv/i);
    assert.match(readme, /Autoresearch should read Project Context before a snapshot/i);
  });

  it('teaches Pro query aggregations, free compare metrics, and the errors guardrail', () => {
    assert.match(skill, /properties_received/);
    assert.match(skill, /properties-received my-site/);
    assert.match(skill, /data-track-vitals="true"/);
    assert.match(skill, /\$web_vitals/);
    assert.match(skill, /Hosted stores `cwv_\*` on `page_view`/);
    assert.doesNotMatch(skill, /`n` of 0 means that event is wrong/);
    assert.doesNotMatch(skill, /Some sites put/);
    assert.doesNotMatch(skill, /stock tracker sends/);
    assert.match(skill, /--metrics sum --property revenue/);
    assert.match(skill, /metrics are `sum`, `avg`, `p50`, `p75`, and `p95`/i);
    assert.match(skill, /aa\.track\('purchase', \{ revenue: 29, currency: 'USD' \}\)/);
    assert.match(skill, /`n` \(values used\)/);
    assert.match(skill, /`skipped` \(values ignored\)/);
    assert.match(skill, /nearest_rank/);
    assert.match(skill, /These aggregations are Pro/);
    assert.match(skill, /`compare` with `metric` stays free/);
    assert.match(skill, /The `errors` read is Pro/);
    assert.match(skill, /--metric 'p75\(cwv_lcp\)' --metric-event page_view --better lower/);
    assert.doesNotMatch(skill, /--metric-event '\$web_vitals'/);
    assert.doesNotMatch(skill, /"value":"\$web_vitals"/);
    assert.doesNotMatch(skill, /not on page_view|not a field on `page_view`/);
    assert.match(skill, /--metric 'sum\(revenue\)' --better higher/);
    assert.match(skill, /--metric-event/);
    assert.match(skill, /no_interval_for_metric/);
    assert.match(skill, /raw_lift/);
    assert.match(skill, /per_user/);
    assert.match(skill, /interval_method/);
    assert.match(skill, /errors <project> --since 7d --new-since <ship date>/);
    assert.match(skill, /The MCP tool is `errors`/);
    assert.match(skill, /every stored `\$error` for that fingerprint/);
    assert.match(skill, /has no stack/);
    assert.match(skill, /source filename, and `line`/);
    assert.match(skill, /full UTC timestamp/);
    assert.match(skill, /boolean `approximate`/);
    assert.match(skill, /`caps`, an array of entries from `distinct_triples` and `window_rows`/);
    assert.match(skill, /list `caps`/);
    assert.doesNotMatch(skill, /name the cap|the cap the response|singular `cap`/);
    assert.doesNotMatch(skill, /20,000/);
    assert.doesNotMatch(skill, /10,000/);
    assert.doesNotMatch(skill, /--property lcp/);
    assert.doesNotMatch(skill, /p75\(lcp\)/);
    assert.doesNotMatch(skill, /top stack/);
    assert.doesNotMatch(skill, /needs Pro/i);
    assert.doesNotMatch(skill, /—|–/);

    assert.match(growthRecipes, /--metric 'p75\(cwv_lcp\)' --metric-event page_view --better lower/);
    assert.match(growthRecipes, /properties_received/);
    assert.match(growthRecipes, /data-track-vitals="true"/);
    assert.match(growthRecipes, /Hosted stores `cwv_\*` on `page_view`/);
    assert.doesNotMatch(growthRecipes, /`n` of 0 means that event is wrong/);
    assert.doesNotMatch(growthRecipes, /Some sites put/);
    assert.doesNotMatch(growthRecipes, /--metric-event '<event>'/);
    assert.doesNotMatch(growthRecipes, /--metric-event '\$web_vitals'/);
    assert.doesNotMatch(growthRecipes, /not on page_view|not a field on `page_view`/);
    assert.match(growthRecipes, /--metric 'sum\(revenue\)' --better higher/);
    assert.match(growthRecipes, /--metric-event/);
    assert.match(growthRecipes, /metric_event/);
    assert.match(growthRecipes, /no_interval_for_metric/);
    assert.match(growthRecipes, /raw_lift/);
    assert.match(growthRecipes, /nearest_rank/);
    assert.match(growthRecipes, /per_user/);
    assert.match(growthRecipes, /interval_method/);
    assert.match(growthRecipes, /errors my-site --since 7d --new-since 2026-04-08/);
    assert.match(growthRecipes, /errors <project> --since 7d --new-since <ship date>/);
    assert.match(growthRecipes, /every stored `\$error` for that fingerprint/);
    assert.match(growthRecipes, /\$error/);
    assert.match(growthRecipes, /has no stack/);
    assert.match(growthRecipes, /numeric `line`/);
    assert.match(growthRecipes, /full UTC timestamp/);
    assert.match(growthRecipes, /boolean `approximate`/);
    assert.match(growthRecipes, /`caps`, an array of entries from `distinct_triples` and `window_rows`/);
    assert.match(growthRecipes, /list `caps`/);
    assert.doesNotMatch(growthRecipes, /name the cap|the cap the response|singular `cap`/);
    assert.doesNotMatch(growthRecipes, /10,000/);
    assert.doesNotMatch(growthRecipes, /20,000/);
    assert.match(growthRecipes, /The MCP tool is `errors`/);
    assert.match(growthRecipes, /uses the vitals read first/);
    assert.match(growthRecipes, /It is Pro/);
    assert.match(growthRecipes, /`errors` is Pro/);
    assert.match(growthRecipes, /`compare` stays free/);
    assert.doesNotMatch(growthRecipes, /p75\(lcp\)/);
    assert.doesNotMatch(growthRecipes, /top stack/);
    assert.doesNotMatch(growthRecipes, /needs Pro/i);
    assert.doesNotMatch(growthRecipes, /PRO_REQUIRED/);
    assert.doesNotMatch(growthRecipes, /—|–/);
    assert.doesNotMatch(growthRecipes, /@agent-analytics\/cli@0\.5\.41 query/);

    assert.match(autoresearchSkill, /p75\(cwv_lcp\)/);
    assert.match(autoresearchSkill, /metric_event` `page_view`/);
    assert.match(autoresearchSkill, /data-track-vitals="true"/);
    assert.match(autoresearchSkill, /vitals read first/);
    assert.doesNotMatch(autoresearchSkill, /`n` of 0 means that event is wrong/);
    assert.doesNotMatch(autoresearchSkill, /Some sites put/);
    assert.doesNotMatch(autoresearchSkill, /metric_event` `\$web_vitals`/);
    assert.match(autoresearchSkill, /sum\(revenue\)/);
    assert.match(autoresearchSkill, /better` `lower`/);
    assert.match(autoresearchSkill, /no_interval_for_metric/);
    assert.match(autoresearchSkill, /raw_lift/);
    assert.match(autoresearchSkill, /errors "\$PROJECT_SLUG" --since 7d --new-since <ship date>/);
    assert.match(autoresearchSkill, /The MCP tool for the guardrail is `errors`/);
    assert.match(autoresearchSkill, /Numeric `query` aggregations and `errors` are Pro/);
    assert.doesNotMatch(autoresearchSkill, /p75\(lcp\)/);
    assert.match(readme, /Pro vitals read first/);
    assert.match(readme, /properties_received/);
    assert.match(readme, /data-track-vitals="true"/);
    assert.match(readme, /`cwv_\*` on `page_view`/);
    assert.match(readme, /--metric-event page_view/);
    assert.doesNotMatch(readme, /`n` of 0 means that event is wrong/);
    assert.doesNotMatch(readme, /Some sites put/);
    assert.doesNotMatch(readme, /--metrics p75 --property cwv_lcp/);
    assert.doesNotMatch(readme, /--metric-event '\$web_vitals'/);
    assert.doesNotMatch(readme, /not on page_view/);
    assert.match(readme, /no_interval_for_metric/);
    assert.match(readme, /errors <project> --since 7d --new-since <ship date>/);
    assert.match(readme, /`compare`, including `compare` with `metric`, stays free on all plans/);
  });

  it('teaches the vitals read for page speed questions', () => {
    for (const content of [skill, growthRecipes, operatingModel, readme, autoresearchSkill]) {
      assert.match(content, /p75 is the headline/);
      assert.match(content, /cwv_pass/);
      assert.match(content, /page_view/);
      assert.match(content, /\$web_vitals/);
      assert.match(content, /data-track-vitals="true"/);
      assert.doesNotMatch(content, /Some sites put/);
      assert.doesNotMatch(content, /stock tracker sends/);
      assert.doesNotMatch(content, /`n` of 0 means that event is wrong/);
      assert.doesNotMatch(content, /—|–/);
      assert.doesNotMatch(content, /@agent-analytics\/cli@0\.5\.40/);
    }

    assert.match(skill, /first read is the vitals read/);
    assert.match(skill, /web_vitals/);
    assert.match(skill, /POST \/vitals/);
    assert.match(skill, /https:\/\/web\.dev\/articles\/vitals/);
    assert.match(skill, /2500 \| 4000/);
    assert.match(skill, /200 \| 500/);
    assert.match(skill, /0\.1 \| 0\.25/);
    assert.match(skill, /1800 \| 3000/);
    assert.match(skill, /800 \| 1800/);
    assert.match(skill, /value <= `good_max` is `good`/);
    assert.match(skill, /value > `poor_min` is `poor`/);
    assert.match(skill, /needs-improvement/);
    assert.match(skill, /needs_improvement/);
    assert.match(skill, /If INP `n` is 0, decide on LCP and CLS/);
    assert.match(skill, /null when LCP `n` is 0 or CLS `n` is 0/);
    assert.match(skill, /--by device/);
    assert.match(skill, /--by path/);
    assert.match(skill, /`mobile`, `tablet`, and `desktop`/);
    assert.match(skill, /worst LCP p75/);
    assert.match(skill, /top_poor_targets/);
    assert.match(skill, /cwv_lcp_target/);
    assert.match(skill, /cwv_inp_target/);
    assert.match(skill, /cwv_cls_target/);
    assert.match(skill, /Chromium/);
    assert.match(skill, /layout-shift/);
    assert.match(skill, /data-track-vitals="false"/);
    assert.match(skill, /Self-hosted core stores `\$web_vitals`/);
    assert.match(skill, /cwv_fcp/);
    assert.match(skill, /cwv_ttfb/);
    assert.match(skill, /perf_ttfb/);
    assert.match(skill, /vitals my-site --days 7/);
    assert.match(skill, /limit` \(default 10, max 20\)/);
    assert.doesNotMatch(skill, /--metrics p75 --property cwv_lcp/);

    assert.match(operatingModel, /first read is the vitals read/);
    assert.match(operatingModel, /web_vitals/);
    assert.match(operatingModel, /POST \/vitals/);
    assert.match(operatingModel, /web\.dev\/articles\/vitals/);
    assert.match(operatingModel, /2500\/4000 ms/);
    assert.match(operatingModel, /200\/500 ms/);
    assert.match(operatingModel, /0\.1\/0\.25/);
    assert.match(operatingModel, /1800\/3000 ms/);
    assert.match(operatingModel, /800\/1800 ms/);
    assert.match(operatingModel, /top_poor_targets/);
    assert.match(operatingModel, /cwv_lcp_target/);
    assert.match(operatingModel, /metric_event` `page_view`/);
    assert.match(operatingModel, /data-track-vitals="false"/);
    assert.doesNotMatch(operatingModel, /query --metrics p75 --property cwv_lcp/);

    assert.match(growthRecipes, /POST \/vitals/);
    assert.match(growthRecipes, /web_vitals/);
    assert.match(growthRecipes, /2500\/4000 ms/);
    assert.match(growthRecipes, /top_poor_targets/);
    assert.match(growthRecipes, /vitals my-site --days 7 --by device/);
  });

  it('teaches one property group-by on query and read-only SQL as an escape hatch', () => {
    assert.match(skill, /`group_by` may include `event`, `date`, `user_id`, `session_id`, and `country`, plus at most one `properties\.<key>`/);
    assert.match(skill, /same rule as a `properties\.<key>` filter/);
    assert.match(skill, /\^\[A-Za-z0-9_\]\+\$/);
    assert.match(skill, /at most 128 characters/);
    assert.match(skill, /Dots and hyphens are not allowed in the key/);
    assert.match(skill, /400 `INVALID_PROPERTY_KEY`/);
    assert.match(skill, /second `properties\.\*` entry returns 400 `INVALID_GROUP_BY`/);
    assert.match(skill, /under the key exactly `properties\.<key>`/);
    assert.match(skill, /null or missing property groups as null/);
    assert.match(skill, /including Pro numeric metrics/);
    assert.match(skill, /row limit stays capped at 1,000/);
    assert.match(skill, /`query` stays Pro/);
    assert.match(skill, /--group-by properties\.path/);
    assert.match(skill, /--group-by date,properties\.path/);
    assert.match(skill, /\["date", "properties\.path"\]/);
    assert.match(skill, /MCP `analytics_breakdown`/);
    assert.match(skill, /Use `query` when you also need other metrics, filters, a date bucket, or another built-in group/);

    assert.match(skill, /## Read-only SQL/);
    assert.match(skill, /Prefer `query` and `analytics_breakdown`/);
    assert.match(skill, /Use MCP `run_sql` or CLI `aa sql` only when those cannot express the question/);
    assert.match(skill, /MCP `run_sql`/);
    assert.match(skill, /CLI `aa sql`/);
    assert.match(skill, /API `POST \/sql`/);
    assert.match(skill, /It is Pro/);
    assert.match(skill, /403 `PRO_REQUIRED` and that blocked call is not metered/);
    assert.match(skill, /not registered on the demo MCP/);
    assert.match(skill, /SQL covers a time window, so pass `days` or a date range/);
    assert.match(skill, /`days` defaults to 7 and maxes at 90/);
    assert.match(skill, /`date_from` and `date_to` are `YYYY-MM-DD`/);
    assert.match(skill, /span is at most 90 days/);
    assert.match(skill, /400 `INVALID_WINDOW`/);
    assert.match(skill, /response `window` has `date_from` and `date_to`/);
    assert.match(skill, /rows outside it are not returned/);
    assert.match(skill, /sql my-site --days 7 --sql '/);
    assert.match(skill, /sql my-site --from 2026-04-01 --to 2026-04-07 -f query\.sql/);
    assert.match(skill, /CLI `--days` sets `days`/);
    assert.match(skill, /CLI `--from` and `--to` set `date_from` and `date_to`/);
    assert.match(skill, /one `SELECT`/);
    assert.match(skill, /starts with `WITH` is rejected/);
    assert.match(skill, /At most 2 references to `events` or `sessions`/);
    assert.match(skill, /A third reference is 400 `INVALID_SQL`/);
    assert.match(skill, /One query at a time per account/);
    assert.match(skill, /429 `SQL_BUSY` with `Retry-After`/);
    assert.match(skill, /429 `SQL_COOLDOWN` with `Retry-After`/);
    assert.match(skill, /On `SQL_BUSY` or `SQL_COOLDOWN`, wait for `Retry-After` instead of retrying in a loop/);
    assert.match(skill, /`events` columns: `id`, `event`, `properties`, `user_id`, `session_id`, `timestamp`, `date`, `country`/);
    assert.match(skill, /`sessions` columns: `session_id`, `user_id`, `project_id`, `start_time`, `end_time`, `duration`, `entry_page`, `exit_page`, `event_count`, `is_bounce`, `date`/);
    assert.match(skill, /`resolved_user_id` is not a column/);
    assert.match(skill, /`events` has no `project_id` column/);
    assert.match(skill, /at most 1,000 rows/);
    assert.match(skill, /`truncated` is true when more rows matched/);
    assert.match(skill, /Do not start with `run_sql` or `aa sql`/);
    assert.match(skill, /Use MCP `run_sql` or CLI `aa sql` only when `query` and `breakdown` cannot express the question/);
    assert.match(skill, /Prefer `query` and `analytics_breakdown`\. Pass `days` or a date range/);
    assert.doesNotMatch(skill, /raw SQL/i);
    assert.doesNotMatch(skill, /—|–/);
    assert.doesNotMatch(skill, /10,000/);

    assert.match(readme, /group one `query` by a single `properties\.<key>`/);
    assert.match(readme, /Prefer `query` and `analytics_breakdown`/);
    assert.match(readme, /MCP `run_sql` or CLI `aa sql`/);
    assert.match(readme, /analytics_breakdown/);
    assert.match(readme, /`days` default 7, max 90/);
    assert.match(readme, /at most 2 references to `events` or `sessions`/);
    assert.match(readme, /one query at a time per account/);
    assert.match(readme, /at most 1,000 rows, and is Pro/);
    assert.match(readme, /On `SQL_BUSY` or `SQL_COOLDOWN`, wait for `Retry-After` instead of retrying in a loop/);
    assert.doesNotMatch(readme, /—|–/);
  });
});
