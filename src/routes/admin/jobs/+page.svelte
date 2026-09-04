<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';
	import { toast } from 'svelte-sonner';

	let { form } = $props();
	let dispatching = $state(false);
</script>

<svelte:head>
	<title>Queue & Background Jobs - Sangria Admin</title>
</svelte:head>

<div class="max-w-4xl space-y-6">
	<!-- Page Header -->
	<div>
		<h1
			class="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
		>
			<AdminIcon name="Cpu" class="h-6 w-6 text-rose-500" />
			<span>Background Jobs & Queue Engine</span>
		</h1>
		<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
			PostgreSQL-backed job queue powered by <code
				class="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">pg-boss</code
			>.
		</p>
	</div>

	<!-- Status Card -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<div
			class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs text-zinc-500 dark:text-zinc-400">Queue Engine</div>
			<div class="mt-1 flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white">
				<span class="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></span>
				<span>pg-boss / PostgreSQL 18</span>
			</div>
		</div>

		<div
			class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs text-zinc-500 dark:text-zinc-400">CLI Worker Command</div>
			<div class="mt-1 font-mono text-xs font-medium text-rose-600 dark:text-rose-400">
				pnpm sangria queue:work
			</div>
		</div>

		<div
			class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs text-zinc-500 dark:text-zinc-400">Automatic Retries</div>
			<div class="mt-1 text-base font-bold text-zinc-900 dark:text-white">Exponential Backoff</div>
		</div>
	</div>

	{#if form?.success}
		<div
			class="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
		>
			<AdminIcon name="Check" class="h-4 w-4 shrink-0" />
			<span>{form.message}</span>
		</div>
	{/if}

	{#if form?.error}
		<div
			class="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
		>
			<AdminIcon name="X" class="h-4 w-4 shrink-0" />
			<span>{form.error}</span>
		</div>
	{/if}

	<!-- Dispatch Test Job Form -->
	<div
		class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
	>
		<h2 class="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
			<AdminIcon name="Activity" class="h-4 w-4 text-rose-500" />
			<span>Dispatch Test Job</span>
		</h2>
		<p class="text-xs text-zinc-500 dark:text-zinc-400">
			Enqueue an asynchronous job to the Postgres queue. Any active worker listening on this job
			topic will process it immediately.
		</p>

		<form
			method="POST"
			action="?/dispatchJob"
			use:enhance={() => {
				dispatching = true;
				return async ({ result, update }) => {
					dispatching = false;
					if (result.type === 'success') {
						toast.success('Job dispatched successfully');
					}
					await update();
				};
			}}
			class="space-y-4"
		>
			<div>
				<label
					for="jobName"
					class="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
				>
					Job Name / Topic
				</label>
				<input
					type="text"
					id="jobName"
					name="jobName"
					value="send-welcome-email"
					required
					class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 font-mono text-xs text-zinc-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
				/>
			</div>

			<div>
				<label
					for="payload"
					class="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
				>
					Payload (JSON)
				</label>
				<textarea
					id="payload"
					name="payload"
					rows="3"
					required
					class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 font-mono text-xs text-zinc-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
					>{JSON.stringify(
						{ to: 'user@example.com', template: 'welcome', timestamp: Date.now() },
						null,
						2
					)}</textarea
				>
			</div>

			<button
				type="submit"
				disabled={dispatching}
				class="flex cursor-pointer items-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-600 disabled:opacity-50"
			>
				{#if dispatching}
					<AdminIcon name="RefreshCw" class="h-3.5 w-3.5 animate-spin" />
					<span>Dispatching...</span>
				{:else}
					<AdminIcon name="Plus" class="h-3.5 w-3.5" />
					<span>Enqueue Job</span>
				{/if}
			</button>
		</form>
	</div>
</div>
