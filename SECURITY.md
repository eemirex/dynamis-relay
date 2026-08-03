# Security policy

Please do not open a public issue for a suspected vulnerability. Contact the repository owner through the email on the associated GitHub profile and include the affected surface, reproduction steps, and likely impact without attaching live credentials or customer data.

## Deployment checklist

- Use only a browser-safe Supabase publishable key in `NEXT_PUBLIC_*` variables.
- Keep the service-role key, AI credentials, and webhook secrets server-side.
- Set `NEXT_PUBLIC_DEMO_MODE=false` for connected production environments.
- Apply migrations and test RLS with users from two different organizations.
- Restrict OAuth redirects to controlled domains.
- Require HTTPS for provider and customer webhook destinations.
- Apply rate limits to authentication, inbound webhook, AI, and replay routes.
- Rotate provider and webhook credentials after suspected exposure.
- Review dead letters, repeated retries, and audit history regularly.
- Treat message content, attachments, and AI context as customer data with an explicit retention policy.
