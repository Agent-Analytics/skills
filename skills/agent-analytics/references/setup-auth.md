# Setup and auth reference

Use this file only when the compact skill needs more detail for setup, authentication, access level, paid-tier handoff, or managed-runtime storage.

## Official CLI path

Use live Agent Analytics through:

```bash
npx --yes @agent-analytics/cli@0.5.41 <command>
```

Do not replace it with raw HTTP, local binaries, repo-local scripts, or MCP unless the user explicitly asks.

## Browser approval first

For Claude Code, Codex, Cursor, and local CLI runtimes:

```bash
npx --yes @agent-analytics/cli@0.5.41 login --level admin
npx --yes @agent-analytics/cli@0.5.41 create my-site --domain https://mysite.com
npx --yes @agent-analytics/cli@0.5.41 login --project my-site --level read
npx --yes @agent-analytics/cli@0.5.41 events my-site --event <first_useful_event> --days 7 --limit 20
```

The CLI opens browser approval and waits for the callback. Do not choose detached login only because an agent is running the shell.

## Access level

Request the lowest level that fits. Read is the default. Request manage only when the user asked to change data or erase someone. Name the project at login: `login --project <name> --level read`. When the account has no project yet, or the user asks to create one, log in with `--level admin` and no `--project` (All projects), run create, then use read or manage for normal work. Creating a project needs admin with All projects. Context, annotations, experiments, feedback and replay writes need manage. Pass `--project <name> --level read` on `login --detached` as well. For a new project, detached login is `login --detached --level admin` with no `--project`. A 404 on another project means the session is limited to its granted project. `whoami` shows the granted project and level; `legacy` means an older all-projects session. Erasure still runs only when the user explicitly asked to delete a person. Erasure needs manage or admin. That level grants `erasures:write`. A read session gets 403 `FORBIDDEN_SCOPE`.

## Detached approval

Use detached approval for Paperclip, OpenClaw, issue-based or headless runtimes, or failed callback environments:

1. Run `npx --yes @agent-analytics/cli@0.5.41 login --detached --project <name> --level read`. When the account has no project yet, or the user asks to create one, run `login --detached --level admin` with no `--project`, then `create`, then log in again at read or manage.
2. Send the approval URL to the user.
3. Wait for the finish code.
4. Run the printed exchange command.
5. Continue with project setup and verification.

Do not ask for raw API keys.

## Managed-runtime storage

For OpenClaw and similar runtimes, store auth in a persistent workspace path:

```bash
export AGENT_ANALYTICS_CONFIG_DIR="$PWD/.openclaw/agent-analytics"
npx --yes @agent-analytics/cli@0.5.41 auth status
```

If environment persistence is uncertain, prefix every command:

```bash
AGENT_ANALYTICS_CONFIG_DIR="$PWD/.openclaw/agent-analytics" npx --yes @agent-analytics/cli@0.5.41 projects
```

`--config-dir "$PWD/.openclaw/agent-analytics"` is also valid. Ensure `.openclaw/` is gitignored. Never commit `.openclaw/agent-analytics/config.json`.

## Paid-tier handoff

Run the requested command first. If it returns `PRO_REQUIRED` or a free-tier cap:

```bash
npx --yes @agent-analytics/cli@0.5.41 upgrade-link --detached
```

Send the dashboard handoff. It confirms the same account as the CLI and opens payment. The browser link uses a fixed reason and excludes full commands and private query data; keep the original command in the agent session. After the user confirms upgrade:

```bash
npx --yes @agent-analytics/cli@0.5.41 whoami
```

Then rerun the blocked command. Use `upgrade-link --wait` only when keeping the shell polling is intentional.
