import type { Actions, PageServerLoad } from './$types';
import { storage } from '$lib/sangria';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	let files: any[] = [];
	try {
		await storage.ensureBucket();
		files = await storage.listFiles();
	} catch (err) {
		console.warn('[Admin Storage] Error listing S3 objects:', err);
	}

	return {
		files,
		minioConsoleUrl: 'http://localhost:9001',
		bucket: process.env.S3_BUCKET || 'sangria-media'
	};
};

export const actions: Actions = {
	getUploadUrl: async ({ request }) => {
		const formData = await request.formData();
		const filename = formData.get('filename') as string;
		const contentType = (formData.get('contentType') as string) || 'application/octet-stream';

		if (!filename) return fail(400, { error: 'Filename is required' });

		try {
			const key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
			const uploadUrl = await storage.getPresignedUploadUrl(key, contentType);
			return { success: true, uploadUrl, key };
		} catch (err: any) {
			return fail(500, { error: err?.message || 'Failed to generate upload URL' });
		}
	},
	deleteFile: async ({ request }) => {
		const formData = await request.formData();
		const key = formData.get('key') as string;
		if (!key) return fail(400, { error: 'Key is required' });

		try {
			await storage.deleteFile(key);
			return { success: true };
		} catch (err: any) {
			return fail(500, { error: err?.message || 'Failed to delete file' });
		}
	}
};
