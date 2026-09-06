import crypto from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import session from '../../api/ci/session.js';

const issuer = 'https://identity.example.test';
const audience = 's2-ci';
const keyPair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const publicJwk = keyPair.publicKey.export({ format: 'jwk' });

function tokenFor(claims, kid = 'test-key') {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid, typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ iss: issuer, aud: audience, exp: Math.floor(Date.now() / 1000) + 300, ...claims })).toString('base64url');
    const input = `${header}.${payload}`;
    const signature = crypto.createSign('RSA-SHA256').update(input).end().sign(keyPair.privateKey).toString('base64url');
    return `${input}.${signature}`;
}

function responseMock() {
    return {
        statusCode: 200,
        headers: {},
        body: '',
        status(code) { this.statusCode = code; return this; },
        setHeader(name, value) { this.headers[name] = value; return this; },
        send(body) { this.body = body; return this; },
    };
}

describe('CI session authentication', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        delete process.env.CI_AUTH_ISSUER;
        delete process.env.CI_AUTH_AUDIENCE;
        delete process.env.CI_AUTH_JWKS_URL;
    });

    it('fails closed when identity is missing', async () => {
        const response = responseMock();
        await session({ method: 'GET', headers: {} }, response);
        expect(response.statusCode).toBe(401);
        expect(response.body).not.toContain('token');
    });

    it('rejects an invalid signed identity', async () => {
        process.env.CI_AUTH_ISSUER = issuer;
        process.env.CI_AUTH_AUDIENCE = audience;
        process.env.CI_AUTH_JWKS_URL = 'https://identity.example.test/.well-known/jwks.json';
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ keys: [publicJwk] }) }));
        const response = responseMock();
        await session({ method: 'GET', headers: { authorization: 'Bearer malformed' } }, response);
        expect(response.statusCode).toBe(401);
    });

    it.each(['CI_VIEWER', 'CI_ANALYST', 'CI_INVESTIGATOR', 'CI_SUPERVISOR', 'CI_ADMIN'])('accepts %s', async (role) => {
        process.env.CI_AUTH_ISSUER = issuer;
        process.env.CI_AUTH_AUDIENCE = audience;
        process.env.CI_AUTH_JWKS_URL = `https://identity.example.test/jwks-${role}`;
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ keys: [{ ...publicJwk, kid: 'test-key' }] }) }));
        const response = responseMock();
        await session({ method: 'GET', headers: { authorization: `Bearer ${tokenFor({ sub: 'user-1', email: 'analyst@example.test', role })}` } }, response);
        expect(response.statusCode).toBe(200);
        expect(response.body).toContain(role);
        expect(response.body).not.toContain('privateKey');
        expect(response.body).not.toContain('secret');
    });

    it('rejects an unexpected role without returning identity data', async () => {
        process.env.CI_AUTH_ISSUER = issuer;
        process.env.CI_AUTH_AUDIENCE = audience;
        process.env.CI_AUTH_JWKS_URL = 'https://identity.example.test/jwks-unexpected';
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ keys: [{ ...publicJwk, kid: 'test-key' }] }) }));
        const response = responseMock();
        await session({ method: 'GET', headers: { authorization: `Bearer ${tokenFor({ role: 'OWNER', email: 'hidden@example.test' })}` } }, response);
        expect(response.statusCode).toBe(403);
        expect(response.body).not.toContain('hidden@example.test');
    });
});
