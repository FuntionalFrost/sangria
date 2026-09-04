export function getEnv(key: string, fallback = ''): string {
	if (typeof process !== 'undefined' && process.env && process.env[key]) {
		return process.env[key] || fallback;
	}
	return fallback;
}
