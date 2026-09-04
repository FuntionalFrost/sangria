<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';
	import { toast } from 'svelte-sonner';

	let { data, form } = $props();
	let sending = $state(false);
</script>

<svelte:head>
	<title>Email Engine & Mailpit - Sangria Admin</title>
</svelte:head>

<div class="max-w-4xl space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1
				class="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
			>
				<AdminIcon name="Mail" class="h-6 w-6 text-rose-500" />
				<span>Transactional Email & Mailpit</span>
			</h1>
			<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
				Integrated Nodemailer transport + Mailpit local dev inbox on <code
					class="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">localhost:1025</code
				>.
			</p>
		</div>

		<div>
			<a
				href={data.mailpitUrl}
				target="_blank"
				rel="noreferrer"
				class="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-amber-600"
			>
				<span>Open Mailpit Inbox</span>
				<AdminIcon name="ExternalLink" class="h-4 w-4" />
			</a>
		</div>
	</div>

	<!-- Status Card -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<div
			class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs text-zinc-500 dark:text-zinc-400">SMTP Host</div>
			<div class="mt-1 font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
				localhost:1025
			</div>
		</div>

		<div
			class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs text-zinc-500 dark:text-zinc-400">Mailpit Web UI</div>
			<div class="mt-1 font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
				http://localhost:8025
			</div>
		</div>

		<div
			class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs text-zinc-500 dark:text-zinc-400">Template Engine</div>
			<div class="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
				better-svelte-email
			</div>
		</div>
	</div>

	{#if form?.success}
		<div
			class="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
		>
			<div class="flex items-center gap-2">
				<AdminIcon name="Check" class="h-4 w-4 shrink-0" />
				<span>Email sent successfully to <strong>{form.to}</strong> (ID: {form.messageId})</span>
			</div>
			<a href={data.mailpitUrl} target="_blank" rel="noreferrer" class="font-bold underline"
				>View in Mailpit ?</a
			>
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

	<!-- Send Test Email Form -->
	<div
		class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
	>
		<h2 class="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
			<AdminIcon name="Mail" class="h-4 w-4 text-rose-500" />
			<span>Send Test Email</span>
		</h2>

		<form
			method="POST"
			action="?/sendTest"
			use:enhance={() => {
				sending = true;
				return async ({ result, update }) => {
					sending = false;
					if (result.type === 'success') {
						toast.success('Test email sent! Check Mailpit.');
					}
					await update();
				};
			}}
			class="space-y-4"
		>
			<div>
				<label for="to" class="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
					Recipient Email
				</label>
				<input
					type="email"
					id="to"
					name="to"
					value="test-user@sangria.local"
					required
					class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
				/>
			</div>

			<div>
				<label
					for="subject"
					class="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
				>
					Subject Line
				</label>
				<input
					type="text"
					id="subject"
					name="subject"
					value="Welcome to Sangria Framework! ??"
					required
					class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
				/>
			</div>

			<div>
				<label for="html" class="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
					HTML Content
				</label>
				<textarea
					id="html"
					name="html"
					rows="4"
					required
					class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 font-mono text-xs text-zinc-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
					><div style="font-family: sans-serif; padding: 20px;">
  <h2>Hello from Sangria!</h2>
  <p>This email was dispatched via <strong>Nodemailer</strong> and captured locally by <strong>Mailpit</strong>.</p>
</div></textarea
				>
			</div>

			<button
				type="submit"
				disabled={sending}
				class="flex cursor-pointer items-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-600 disabled:opacity-50"
			>
				{#if sending}
					<AdminIcon name="RefreshCw" class="h-3.5 w-3.5 animate-spin" />
					<span>Sending Email...</span>
				{:else}
					<AdminIcon name="Mail" class="h-3.5 w-3.5" />
					<span>Send Email</span>
				{/if}
			</button>
		</form>
	</div>
</div>
