import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let envDatabaseUrl: string | undefined;
try {
	const { env } = await import('$env/dynamic/private');
	envDatabaseUrl = env?.DATABASE_URL;
} catch {
	// Standalone / CLI runtime
}

const connectionString =
	envDatabaseUrl ||
	process.env.DATABASE_URL ||
	'postgres://root:mysecretpassword@localhost:5432/local';

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
