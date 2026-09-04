import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { SangriaUser } from './app';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user as unknown as SangriaUser;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

const handleAdminGuard: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/admin') && !event.url.pathname.startsWith('/admin/login')) {
		if (!event.locals.user) {
			const redirect = encodeURIComponent(event.url.pathname + event.url.search);
			return new Response(null, {
				status: 302,
				headers: { Location: `/admin/login?redirectTo=${redirect}` }
			});
		}
		const role = event.locals.user.role;
		if (role !== 'admin' && role !== 'superadmin') {
			return new Response('Forbidden: Administrator access required.', {
				status: 403,
				headers: { 'Content-Type': 'text/plain' }
			});
		}
	}
	return resolve(event);
};

export const handle: Handle = sequence(handleBetterAuth, handleAdminGuard);
