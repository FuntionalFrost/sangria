import { PgBoss } from 'pg-boss';
import { getEnv } from '../core/env';

export interface JobDefinition<TData = Record<string, unknown>> {
	name: string;
	handler: (job: { id: string; name: string; data: TData }) => Promise<void>;
}

class SangriaQueue {
	private boss: PgBoss | null = null;
	private handlers: Map<string, (job: any) => Promise<void>> = new Map();
	private isStarted = false;

	private getBoss(): PgBoss {
		if (!this.boss) {
			const connectionString = getEnv(
				'DATABASE_URL',
				'postgres://root:mysecretpassword@localhost:5432/local'
			);
			this.boss = new PgBoss({
				connectionString,
				application_name: 'sangria-queue',
				max: 10
			});

			this.boss.on('error', (error) => {
				console.error('[Sangria Queue Error]', error);
			});
		}
		return this.boss;
	}

	async start(): Promise<void> {
		if (this.isStarted) return;
		try {
			const boss = this.getBoss();
			await boss.start();
			this.isStarted = true;

			// Register all queued handlers
			for (const [name, handler] of this.handlers.entries()) {
				await boss.work(name, async (jobs) => {
					for (const job of jobs) {
						await handler(job as any);
					}
				});
			}
			console.log('[Sangria Queue] Started successfully');
		} catch (err) {
			console.warn('[Sangria Queue] Could not connect to Postgres queue yet:', err);
		}
	}

	async registerWorker<T = any>(
		name: string,
		handler: (job: { id: string; name: string; data: T }) => Promise<void>
	): Promise<void> {
		this.handlers.set(name, handler);
		if (this.isStarted && this.boss) {
			await this.boss.work(name, async (jobs) => {
				for (const job of jobs) {
					await handler(job as any);
				}
			});
		}
	}

	async send(
		name: string,
		data: Record<string, unknown> = {},
		options: { startAfter?: number | Date; retryLimit?: number } = {}
	): Promise<string | null> {
		const boss = this.getBoss();
		if (!this.isStarted) {
			await this.start();
		}
		return await boss.send(name, data, options);
	}

	async stop(): Promise<void> {
		if (this.boss && this.isStarted) {
			await this.boss.stop();
			this.isStarted = false;
		}
	}
}

export const queue = new SangriaQueue();
