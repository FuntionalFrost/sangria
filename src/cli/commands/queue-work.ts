import * as p from '@clack/prompts';
import { defineCommand } from 'citty';
import { queue } from '../../lib/sangria/jobs/queue';

export const queueWorkCommand = defineCommand({
	meta: {
		name: 'queue:work',
		description: 'Start the Sangria background queue worker process'
	},
	async run() {
		p.intro('Sangria - Queue Worker');
		p.log.info('Starting pg-boss worker engine...');

		try {
			await queue.start();
			p.log.success('Queue worker is running and listening for jobs. Press Ctrl+C to stop.');

			// Keep alive
			await new Promise(() => {});
		} catch (err: any) {
			p.log.error(err?.message || 'Worker encountered an error.');
		}
	}
});
