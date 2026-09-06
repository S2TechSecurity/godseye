# CI API boundary

The `/api/ci/*` endpoints require a signed bearer token issued by the configured identity provider. Configure these server-only Vercel environment variables:

- `CI_AUTH_ISSUER`
- `CI_AUTH_AUDIENCE`
- `CI_AUTH_JWKS_URL`

The endpoints fail closed with `401` when identity configuration or credentials are missing or invalid. A valid token without one of the approved CI roles receives `403`.

Approved roles are `CI_VIEWER`, `CI_ANALYST`, `CI_INVESTIGATOR`, `CI_SUPERVISOR`, and `CI_ADMIN`. No `VITE_` variables are used for authentication configuration, and session responses contain only safe identity fields.
