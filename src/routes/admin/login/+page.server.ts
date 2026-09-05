import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user && (locals.user.role === 'admin' || locals.user.role === 'superadmin')) {
		const redirectTo = url.searchParams.get('redirectTo') || '/admin';
		throw redirect(302, redirectTo);
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const redirectTo = (formData.get('redirectTo') as string) || '/admin';

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		try {
			const res = await auth.api.signInEmail({
				body: { email, password },
				headers: request.headers
			});

			if (res?.user?.role !== 'admin' && res?.user?.role !== 'superadmin') {
				await auth.api.signOut({ headers: request.headers }).catch(() => {});
				return fail(403, { error: 'Forbidden: Administrator privileges required', email });
			}
		} catch (err: any) {
			return fail(400, { error: err?.message || 'Invalid email or password', email });
		}

		throw redirect(302, redirectTo);
	},
	logout: async ({ request }) => {
		try {
			await auth.api.signOut({
				headers: request.headers
			});
		} catch {
			// ignore
		}
		throw redirect(302, '/admin/login');
	}
};
