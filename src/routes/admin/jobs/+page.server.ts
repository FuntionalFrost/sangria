import type { Actions, PageServerLoad } from './$types';
import { queue } from '$lib/sangria';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		queueName: 'default',
		status: 'active'
	};
};

export const actions: Actions = {
	dispatchJob: async ({ request }) => {
		const formData = await request.formData();
		const jobName = (formData.get('jobName') as string) || 'example-task';
		const payloadRaw =
			(formData.get('payload') as string) || '{"message":"Hello from Sangria Queue"}';

		try {
			const payload = JSON.parse(payloadRaw);
			const jobId = await queue.send(jobName, payload);
			return { success: true, jobId, message: `Dispatched job "${jobName}" with ID ${jobId}` };
		} catch (err: any) {
			return fail(400, { error: err?.message || 'Failed to dispatch job' });
		}
	}
};
