import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, requiredRole }) {
    const [state, setState] = useState({ status: 'loading', identity: null });

    useEffect(() => {
        let active = true;
        fetch('/api/ci/session', { credentials: 'same-origin' })
            .then(async (response) => ({ response, body: await response.json() }))
            .then(({ response, body }) => {
                if (!active) return;
                if (response.status === 401) setState({ status: 'unauthenticated', identity: null });
                else if (response.status === 403) setState({ status: 'forbidden', identity: null });
                else if (!response.ok) setState({ status: 'error', identity: null });
                else setState({ status: 'authorized', identity: body.identity });
            })
            .catch(() => {
                if (active) setState({ status: 'error', identity: null });
            });
        return () => { active = false; };
    }, []);

    if (state.status === 'loading') return <div role="status">Checking access...</div>;
    if (state.status === 'unauthenticated') return <div role="alert">Authentication required.</div>;
    if (state.status === 'forbidden' || (requiredRole && !state.identity?.roles?.includes(requiredRole) && !state.identity?.roles?.includes('CI_ADMIN'))) {
        return <div role="alert">You are not authorized to access this area.</div>;
    }
    if (state.status !== 'authorized') return <div role="alert">Access verification failed.</div>;
    return children;
}
