<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';

	let { form } = $props();
	let loading = $state(false);

	const redirectTo = $derived(page.url.searchParams.get('redirectTo') || '/admin');
</script>

<svelte:head>
	<title>Admin Login - Sangria</title>
</svelte:head>

<div
	class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
>
	<div class="mb-8 flex flex-col items-center text-center">
		<div
			class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/30"
		>
			<span class="text-xl font-black">S</span>
		</div>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Sangria Admin</h1>
		<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
			Sign in with your administrator credentials
		</p>
	</div>

	{#if form?.error}
		<div
			class="mb-6 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
		>
			<AdminIcon name="X" class="h-4 w-4 shrink-0" />
			<span>{form.error}</span>
		</div>
	{/if}

	<form
		method="POST"
		action="?/login"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		class="space-y-4"
	>
		<input type="hidden" name="redirectTo" value={redirectTo} />

		<div>
			<label
				for="email"
				class="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
			>
				Email Address
			</label>
			<input
				id="email"
				type="email"
				name="email"
				value={form?.email || ''}
				required
				autocomplete="email"
				placeholder="admin@sangria.local"
				class="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
			/>
		</div>

		<div>
			<label
				for="password"
				class="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
			>
				Password
			</label>
			<input
				id="password"
				type="password"
				name="password"
				required
				autocomplete="current-password"
				placeholder="��������"
				class="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
			/>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-rose-500/20 transition-all hover:from-rose-600 hover:to-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if loading}
				<AdminIcon name="RefreshCw" class="h-4 w-4 animate-spin" />
				<span>Signing in...</span>
			{:else}
				<span>Sign In to Admin</span>
			{/if}
		</button>
	</form>

	<div
		class="mt-6 border-t border-zinc-100 pt-6 text-center text-[11px] text-zinc-400 dark:border-zinc-800"
	>
		Need an admin account? Run <code
			class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
			>pnpm sangria createsuperuser</code
		> in your terminal.
	</div>
</div>
