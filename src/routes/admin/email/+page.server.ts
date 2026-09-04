import type { Actions, PageServerLoad } from './$types';
import { mailer } from '$lib/sangria';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		mailpitUrl: 'http://localhost:8025'
	};
};

export const actions: Actions = {
	sendTest: async ({ request }) => {
		const formData = await request.formData();
		const to = (formData.get('to') as string) || 'developer@example.com';
		const subject = (formData.get('subject') as string) || 'Test Email from Sangria';
		const html = (formData.get('html') as string) || '<p>Hello from <strong>Sangria</strong>!</p>';

		try {
			const result = await mailer.send({
				to,
				subject,
				html
			});
			return { success: true, messageId: result.messageId, to };
		} catch (err: any) {
			return fail(500, { error: err?.message || 'Failed to send test email' });
		}
	}
};
