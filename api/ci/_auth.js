import crypto from 'node:crypto';

const allowedRoles = new Set([
    'CI_VIEWER',
    'CI_ANALYST',
    'CI_INVESTIGATOR',
    'CI_SUPERVISOR',
    'CI_ADMIN',
]);

let jwksCache;

function sendJson(response, status, body) {
    response.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body));
}

function unauthorized(response) {
    sendJson(response, 401, { error: 'unauthorized' });
}

function forbidden(response) {
    sendJson(response, 403, { error: 'forbidden' });
}

function base64UrlDecode(value) {
    return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function parseJwt(token) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('invalid token');
    return {
        encodedHeader: parts[0],
        encodedPayload: parts[1],
        signature: base64UrlDecode(parts[2]),
        header: JSON.parse(base64UrlDecode(parts[0]).toString('utf8')),
        payload: JSON.parse(base64UrlDecode(parts[1]).toString('utf8')),
    };
}

function getBearerToken(request) {
    const authorization = request.headers.authorization || '';
    if (!authorization.startsWith('Bearer ')) return null;
    return authorization.slice(7).trim() || null;
}

async function getJwks() {
    const url = process.env.CI_AUTH_JWKS_URL;
    if (!url) throw new Error('CI_AUTH_JWKS_URL is not configured');
    if (jwksCache && jwksCache.expiresAt > Date.now()) return jwksCache.keys;

    const response = await fetch(url);
    if (!response.ok) throw new Error('identity key request failed');
    const document = await response.json();
    if (!Array.isArray(document.keys)) throw new Error('identity keys are invalid');
    jwksCache = { keys: document.keys, expiresAt: Date.now() + 300000 };
    return jwksCache.keys;
}

function verifySignature(token, parsed, key) {
    const algorithm = parsed.header.alg;
    const supported = { RS256: 'RSA-SHA256', RS384: 'RSA-SHA384', RS512: 'RSA-SHA512' };
    if (!supported[algorithm] || !key) return false;
    const verifier = crypto.createVerify(supported[algorithm]);
    verifier.update(`${parsed.encodedHeader}.${parsed.encodedPayload}`);
    verifier.end();
    return verifier.verify(crypto.createPublicKey({ key, format: 'jwk' }), parsed.signature);
}

function getRoles(payload) {
    const values = Array.isArray(payload.roles) ? payload.roles : [payload.role];
    return values.filter((role) => typeof role === 'string' && allowedRoles.has(role));
}

export async function authenticate(request, response) {
    const token = getBearerToken(request);
    const issuer = process.env.CI_AUTH_ISSUER;
    const audience = process.env.CI_AUTH_AUDIENCE;
    if (!token || !issuer || !audience) {
        unauthorized(response);
        return null;
    }

    try {
        const parsed = parseJwt(token);
        const keys = await getJwks();
        const key = keys.find((candidate) => candidate.kid === parsed.header.kid);
        const now = Math.floor(Date.now() / 1000);
        const claims = parsed.payload;
        const validIssuer = claims.iss === issuer;
        const validAudience = Array.isArray(claims.aud) ? claims.aud.includes(audience) : claims.aud === audience;
        const validTime = typeof claims.exp === 'number' && claims.exp > now && (!claims.nbf || claims.nbf <= now);

        if (!verifySignature(token, parsed, key) || !validIssuer || !validAudience || !validTime) {
            unauthorized(response);
            return null;
        }

        const roles = getRoles(claims);
        if (roles.length === 0) {
            forbidden(response);
            return null;
        }

        return {
            subject: typeof claims.sub === 'string' ? claims.sub : null,
            email: typeof claims.email === 'string' ? claims.email : null,
            name: typeof claims.name === 'string' ? claims.name : null,
            roles,
        };
    } catch {
        unauthorized(response);
        return null;
    }
}

export function requireRole(identity, role) {
    return identity.roles.includes(role) || identity.roles.includes('CI_ADMIN');
}

export function safeIdentity(identity) {
    return {
        subject: identity.subject,
        email: identity.email,
        name: identity.name,
        roles: identity.roles,
    };
}

export { forbidden, sendJson };
