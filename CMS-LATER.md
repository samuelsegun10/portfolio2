# Optional CMS later

This basic self-service kit is maintained by editing content/portfolio.json in GitHub, Codex or another text editor. It does not include an active /admin/ login and does not require Cloudflare.

A GitHub-backed CMS such as Decap needs separate GitHub OAuth authentication. A coding agent can help prepare and check the configuration, but the account owner must create or authorize the OAuth app, keep its secret in the hosting service's secret store, and test login, editing, image upload and publication. Never put a client secret in this repository or an agent prompt.

The earlier CMS pilot has not completed this end-to-end test. Treat CMS as an optional follow-up until a documented self-service setup is verified. A Cloudflare account alone does not activate it.

