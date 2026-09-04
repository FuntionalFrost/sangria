<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	let uploading = $state(false);
	let selectedFile: File | null = $state(null);

	async function handleUpload(e: SubmitEvent) {
		e.preventDefault();
		if (!selectedFile) {
			toast.error('Please select a file to upload');
			return;
		}

		uploading = true;
		try {
			// 1. Get presigned upload URL
			const formData = new FormData();
			formData.append('filename', selectedFile.name);
			formData.append('contentType', selectedFile.type);

			const res = await fetch('?/getUploadUrl', {
				method: 'POST',
				body: formData
			});
			const result = await res.json();
			const payload = JSON.parse(result.data);

			if (!payload[1]?.uploadUrl) {
				throw new Error('Could not get upload URL');
			}

			const { uploadUrl } = payload[1];

			// 2. Direct upload to S3 / MinIO
			await fetch(uploadUrl, {
				method: 'PUT',
				body: selectedFile,
				headers: {
					'Content-Type': selectedFile.type
				}
			});

			toast.success('File uploaded to S3 storage successfully!');
			selectedFile = null;
			await invalidateAll();
		} catch (err: any) {
			toast.error(err?.message || 'Upload failed');
		} finally {
			uploading = false;
		}
	}

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}
</script>

<svelte:head>
	<title>S3 & MinIO Storage - Sangria Admin</title>
</svelte:head>

<div class="max-w-4xl space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1
				class="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
			>
				<AdminIcon name="HardDrive" class="h-6 w-6 text-rose-500" />
				<span>Object Storage (S3 & MinIO)</span>
			</h1>
			<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
				Direct pre-signed uploads and media bucket management (<code
					class="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">{data.bucket}</code
				>).
			</p>
		</div>

		<div>
			<a
				href={data.minioConsoleUrl}
				target="_blank"
				rel="noreferrer"
				class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-purple-700"
			>
				<span>Open MinIO Console</span>
				<AdminIcon name="ExternalLink" class="h-4 w-4" />
			</a>
		</div>
	</div>

	<!-- Status Card -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<div
			class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs text-zinc-500 dark:text-zinc-400">S3 Endpoint</div>
			<div class="mt-1 font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
				localhost:9000
			</div>
		</div>

		<div
			class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs text-zinc-500 dark:text-zinc-400">Target Bucket</div>
			<div class="mt-1 font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
				{data.bucket}
			</div>
		</div>

		<div
			class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs text-zinc-500 dark:text-zinc-400">Upload Architecture</div>
			<div class="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
				Pre-signed URLs (Direct)
			</div>
		</div>
	</div>

	<!-- Upload Form Card -->
	<div
		class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
	>
		<h2 class="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
			<AdminIcon name="UploadCloud" class="h-4 w-4 text-rose-500" />
			<span>Upload Object</span>
		</h2>

		<form onsubmit={handleUpload} class="flex flex-col items-center gap-3 sm:flex-row">
			<input
				type="file"
				onchange={(e) => {
					const target = e.currentTarget;
					selectedFile = target.files?.[0] || null;
				}}
				class="w-full cursor-pointer text-xs text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-zinc-700 hover:file:bg-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-300 dark:hover:file:bg-zinc-700"
			/>
			<button
				type="submit"
				disabled={uploading || !selectedFile}
				class="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-rose-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-600 disabled:opacity-50 sm:w-auto"
			>
				{#if uploading}
					<AdminIcon name="RefreshCw" class="h-3.5 w-3.5 animate-spin" />
					<span>Uploading...</span>
				{:else}
					<AdminIcon name="UploadCloud" class="h-3.5 w-3.5" />
					<span>Upload File</span>
				{/if}
			</button>
		</form>
	</div>

	<!-- Bucket Explorer -->
	<div
		class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
	>
		<div
			class="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800"
		>
			<h2 class="text-sm font-bold text-zinc-900 dark:text-white">Bucket Objects</h2>
			<span class="text-xs text-zinc-400">{data.files.length} items</span>
		</div>

		{#if data.files.length === 0}
			<div class="py-12 text-center text-xs text-zinc-400">
				No files uploaded yet in bucket "{data.bucket}".
			</div>
		{:else}
			<div class="divide-y divide-zinc-100 text-xs dark:divide-zinc-800">
				{#each data.files as file (file.key)}
					<div
						class="flex items-center justify-between px-5 py-3 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
					>
						<div class="flex items-center gap-3 overflow-hidden">
							<AdminIcon name="Box" class="h-4 w-4 shrink-0 text-purple-500" />
							<span class="truncate font-mono text-zinc-800 dark:text-zinc-200">{file.key}</span>
						</div>
						<div class="flex shrink-0 items-center gap-4">
							<span class="font-mono text-[11px] text-zinc-400">{formatBytes(file.size)}</span>
							<form
								method="POST"
								action="?/deleteFile"
								use:enhance={() => {
									return async ({ result, update }) => {
										if (result.type === 'success') {
											toast.success('File deleted from bucket');
										}
										await update();
									};
								}}
							>
								<input type="hidden" name="key" value={file.key} />
								<button
									type="submit"
									onclick={(e) => {
										if (!confirm('Are you sure you want to delete this file?')) {
											e.preventDefault();
										}
									}}
									class="cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
									title="Delete File"
								>
									<AdminIcon name="Trash2" class="h-3.5 w-3.5" />
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
