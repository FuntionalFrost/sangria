import type { User as BetterAuthUser, Session } from 'better-auth';

export interface SangriaUser extends BetterAuthUser {
	role?: string;
	banned?: boolean;
	banReason?: string | null;
	banExpires?: Date | null;
}

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: SangriaUser;
			session?: Session;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
