import * as p from '@clack/prompts';
import { defineCommand } from 'citty';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { user, account } from '../../lib/server/db/schema';
import crypto from 'node:crypto';

export const createSuperuserCommand = defineCommand({
	meta: {
		name: 'createsuperuser',
		description: 'Create a superadministrator account for the Sangria Admin panel'
	},
	async run() {
		p.intro('Sangria - Create Superuser');

		const dbUrl =
			process.env.DATABASE_URL || 'postgres://root:mysecretpassword@localhost:5432/local';
		const client = postgres(dbUrl);
		const db = drizzle(client);

		const name = await p.text({
			message: 'Enter admin name:',
			placeholder: 'Admin',
			validate: (val) => (!val ? 'Name is required' : undefined)
		});
		if (p.isCancel(name)) return;

		const email = await p.text({
			message: 'Enter admin email:',
			placeholder: 'admin@sangria.local',
			validate: (val) => (!val || !val.includes('@') ? 'Valid email is required' : undefined)
		});
		if (p.isCancel(email)) return;

		const password = await p.password({
			message: 'Enter admin password:',
			validate: (val) =>
				!val || val.length < 8 ? 'Password must be at least 8 characters' : undefined
		});
		if (p.isCancel(password)) return;

		const s = p.spinner();
		s.start('Creating superuser account...');

		try {
			// Check if user exists
			const existing = await db
				.select()
				.from(user)
				.where(eq(user.email, email as string))
				.limit(1);
			if (existing.length > 0) {
				s.stop('User already exists');
				p.log.error(`A user with email ${email} already exists.`);
				await client.end();
				return;
			}

			const userId = crypto.randomUUID();
			const accountId = crypto.randomUUID();

			// Insert user record with superadmin role
			await db.insert(user).values({
				id: userId,
				name: name as string,
				email: email as string,
				role: 'superadmin',
				emailVerified: true
			});

			// Hash password using PBKDF2 / scrypt
			const salt = crypto.randomBytes(16).toString('hex');
			const hash = crypto.scryptSync(password as string, salt, 64).toString('hex');
			const passwordHash = `${salt}:${hash}`;

			await db.insert(account).values({
				id: accountId,
				userId: userId,
				accountId: email as string,
				providerId: 'credential',
				issuer: 'credential',
				password: passwordHash
			});

			s.stop('Superuser created successfully!');
			p.note(
				`Email: ${email}\nRole: superadmin\nAdmin URL: http://localhost:5173/admin`,
				'Superuser Credentials'
			);
			p.outro('You can now log in at /admin with these credentials.');
		} catch (err: any) {
			s.stop('Failed to create superuser');
			p.log.error(err?.message || 'Database error occurred. Make sure PostgreSQL is running.');
		} finally {
			await client.end();
		}
	}
});
