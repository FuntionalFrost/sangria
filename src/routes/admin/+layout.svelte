<script lang="ts">
	import { page } from '$app/state';
	import { toggleMode } from 'mode-watcher';
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';

	let { data, children } = $props();

	let sidebarOpen = $state(false);

	const isLoginPage = $derived(page.url.pathname === '/admin/login');
</script>

{#if isLoginPage}
	<div
		class="flex min-h-screen items-center justify-center bg-zinc-50 p-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
	>
		{@render children()}
	</div>
{:else}
	<div
		class="flex min-h-screen bg-zinc-100 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
	>
		<!-- Mobile backdrop -->
		{#if sidebarOpen}
			<button
				type="button"
				class="fixed inset-0 z-40 cursor-pointer border-none bg-black/50 md:hidden"
				onclick={() => (sidebarOpen = false)}
				aria-label="Close sidebar"
			></button>
		{/if}

		<!-- Sidebar -->
		<aside
			class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 md:static md:translate-x-0 dark:border-zinc-800 dark:bg-zinc-900 {sidebarOpen
				? 'translate-x-0'
				: '-translate-x-full'}"
		>
			<!-- Brand Header -->
			<div
				class="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800"
			>
				<a
					href="/admin"
					class="group flex items-center gap-2.5 text-lg font-bold text-zinc-900 dark:text-white"
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-sm shadow-rose-500/30"
					>
						<span class="text-sm font-black tracking-tight">S</span>
					</div>
					<div class="flex flex-col">
						<span class="text-base leading-none font-extrabold tracking-tight">Sangria</span>
						<span class="mt-0.5 text-[10px] font-medium tracking-wider text-zinc-400 uppercase"
							>Admin Hub</span
						>
					</div>
				</a>
			</div>

			<!-- Navigation Links -->
			<nav class="flex-1 space-y-6 overflow-y-auto p-4">
				<!-- Dashboard -->
				<div>
					<a
						href="/admin"
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {page
							.url.pathname === '/admin'
							? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
							: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white'}"
					>
						<AdminIcon name="LayoutDashboard" class="h-4 w-4" />
						<span>Dashboard</span>
					</a>
				</div>

				<!-- Grouped Resources -->
				{#each Object.entries(data.groups) as [groupName, resources] (groupName)}
					<div>
						<div
							class="mb-2 px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500"
						>
							{groupName}
						</div>
						<div class="space-y-1">
							{#each resources as res (res.name)}
								{@const active = page.url.pathname.startsWith(`/admin/${res.name}`)}
								<a
									href="/admin/{res.name}"
									class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {active
										? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
										: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white'}"
								>
									<AdminIcon name={res.icon} class="h-4 w-4" />
									<span>{res.label}</span>
								</a>
							{/each}
						</div>
					</div>
				{/each}

				<!-- System Tools -->
				<div>
					<div
						class="mb-2 px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500"
					>
						System & Services
					</div>
					<div class="space-y-1">
						<a
							href="/admin/jobs"
							class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {page.url.pathname.startsWith(
								'/admin/jobs'
							)
								? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
								: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white'}"
						>
							<AdminIcon name="Cpu" class="h-4 w-4" />
							<span>Queue & Jobs</span>
						</a>
						<a
							href="/admin/email"
							class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {page.url.pathname.startsWith(
								'/admin/email'
							)
								? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
								: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white'}"
						>
							<AdminIcon name="Mail" class="h-4 w-4" />
							<span>Email / Mailpit</span>
						</a>
						<a
							href="/admin/storage"
							class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {page.url.pathname.startsWith(
								'/admin/storage'
							)
								? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
								: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white'}"
						>
							<AdminIcon name="HardDrive" class="h-4 w-4" />
							<span>S3 / MinIO Storage</span>
						</a>
					</div>
				</div>
			</nav>

			<!-- Bottom User Info & Actions -->
			<div
				class="flex items-center justify-between border-t border-zinc-200 p-4 dark:border-zinc-800"
			>
				<div class="flex items-center gap-2.5 overflow-hidden">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
					>
						{data.user?.name?.charAt(0).toUpperCase() || 'A'}
					</div>
					<div class="truncate">
						<div class="truncate text-xs leading-tight font-semibold">
							{data.user?.name || 'Administrator'}
						</div>
						<div class="truncate text-[10px] text-zinc-400">{data.user?.role || 'superadmin'}</div>
					</div>
				</div>
				<div class="flex items-center gap-1">
					<button
						type="button"
						onclick={() => toggleMode()}
						class="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
						title="Toggle Theme"
						aria-label="Toggle theme"
					>
						<AdminIcon name="Sun" class="h-4 w-4" />
					</button>
					<form action="/admin/login?/logout" method="POST">
						<button
							type="submit"
							class="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
							title="Sign Out"
							aria-label="Sign out"
						>
							<AdminIcon name="LogOut" class="h-4 w-4" />
						</button>
					</form>
				</div>
			</div>
		</aside>

		<!-- Main Content Area -->
		<div class="flex min-w-0 flex-1 flex-col overflow-x-hidden">
			<!-- Top Header -->
			<header
				class="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900"
			>
				<div class="flex items-center gap-3">
					<button
						type="button"
						class="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
						onclick={() => (sidebarOpen = !sidebarOpen)}
						aria-label="Toggle Sidebar"
					>
						<AdminIcon name="Layers" class="h-5 w-5" />
					</button>
					<div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
						<a href="/admin" class="transition-colors hover:text-zinc-900 dark:hover:text-white"
							>Admin</a
						>
						{#if page.url.pathname !== '/admin'}
							<span>/</span>
							<span class="font-medium text-zinc-800 capitalize dark:text-zinc-200">
								{page.url.pathname.split('/')[2] || ''}
							</span>
						{/if}
					</div>
				</div>

				<div class="flex items-center gap-3">
					<a
						href="/"
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
					>
						<span>View Public Site</span>
						<AdminIcon name="ExternalLink" class="h-3.5 w-3.5" />
					</a>
				</div>
			</header>

			<!-- Page Body -->
			<main class="mx-auto w-full max-w-7xl flex-1 p-6 md:p-8">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
