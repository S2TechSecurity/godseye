import { authenticate, safeIdentity, sendJson } from './_auth.js';

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET');
        return sendJson(response, 405, { error: 'method_not_allowed' });
    }

    const identity = await authenticate(request, response);
    if (!identity) return;
    return sendJson(response, 200, { identity: safeIdentity(identity) });
}
