# CI authentication and RBAC

## Boundary

Private CI APIs are same-origin endpoints under `/api/ci/*`. They verify a signed bearer identity token server-side. Client-supplied role or email headers are never trusted.

The current implementation uses generic OIDC-compatible JWKS verification. No identity provider is configured in this repository yet. Before enabling the protected deployment, configure the selected S2 Tech identity provider and set these Vercel server environment variables for Preview and Production:

- `CI_AUTH_ISSUER`
- `CI_AUTH_AUDIENCE`
- `CI_AUTH_JWKS_URL`

These variables must not use the `VITE_` prefix and must not be exposed to browser bundles.

## Authorization

The approved roles are `CI_VIEWER`, `CI_ANALYST`, `CI_INVESTIGATOR`, `CI_SUPERVISOR`, and `CI_ADMIN`. A valid signed identity with no approved role receives `403`. Missing, malformed, expired, incorrectly issued, incorrectly targeted, or unverifiable credentials receive `401`.

`/api/ci/session` returns only subject, email, display name, and approved roles. It never returns tokens, passwords, private keys, provider credentials, database credentials, camera credentials, or API secrets.

`src/s2ci/ProtectedRoute.jsx` is the client primitive for future private routes. It is not an authorization boundary; server authorization remains mandatory for every private action.

## Deployment gate

Do not bind `ci.s2tech.co.za` or declare the platform live until the identity provider, domain-level access policy, and authenticated browser flow have been verified. If the domain-level policy cannot be established, leave the deployment inaccessible and report the release as blocked.
