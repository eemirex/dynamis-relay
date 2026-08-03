# Contributing

Focused issues and pull requests are welcome.

1. Open an issue before substantial product, schema, or architecture changes.
2. Keep UI additions consistent with the Relay visual system.
3. Add tests for state, retry, idempotency, or authorization changes.
4. Preserve organization scoping and RLS for every new table.
5. Document new failure modes and operational recovery paths.
6. Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` before opening a pull request.

Pull requests should explain the customer problem, design choice, operational impact, tests performed, and any new environment variables or migrations. Never include credentials, provider payloads, private messages, or customer attachments.
