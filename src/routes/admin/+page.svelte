<script lang="ts">
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard - Sangria Admin</title>
</svelte:head>

<div class="space-y-8">
	<!-- Top Welcome & Status Banner -->
	<div
		class="flex flex-col gap-4 rounded-2xl border border-rose-500/20 bg-linear-to-r from-rose-500/10 via-amber-500/5 to-transparent p-6 md:flex-row md:items-center md:justify-between"
	>
		<div>
			<h1
				class="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
			>
				<span>Welcome back, {data.user?.name || 'Administrator'}</span>
				<span
					class="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-white uppercase"
				>
					{data.user?.role || 'superadmin'}
				</span>
			</h1>
			<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
				Batteries-included SvelteKit control panel with PostgreSQL 18, Drizzle, Better-Auth, and
				background workers.
			</p>
		</div>

		<div class="flex items-center gap-2">
			<a
				href="/admin/task/new"
				class="flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-rose-600"
			>
				<AdminIcon name="Plus" class="h-3.5 w-3.5" />
				<span>New Task</span>
			</a>
			<a
				href="/admin/post/new"
				class="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
			>
				<AdminIcon name="Plus" class="h-3.5 w-3.5" />
				<span>New Post</span>
			</a>
		</div>
	</div>

	<!-- System Health / Batteries Included Badges -->
	<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
		<div
			class="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
			>
				<AdminIcon name="Database" class="h-4 w-4" />
			</div>
			<div class="overflow-hidden">
				<div class="text-[11px] font-medium text-zinc-400">Database</div>
				<div class="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-200">
					PostgreSQL 18
				</div>
			</div>
		</div>

		<div
			class="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
			>
				<AdminIcon name="ShieldCheck" class="h-4 w-4" />
			</div>
			<div class="overflow-hidden">
				<div class="text-[11px] font-medium text-zinc-400">Auth & RBAC</div>
				<div class="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-200">
					Better-Auth
				</div>
			</div>
		</div>

		<div
			class="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
			>
				<AdminIcon name="Mail" class="h-4 w-4" />
			</div>
			<div class="overflow-hidden">
				<div class="text-[11px] font-medium text-zinc-400">Email Testing</div>
				<div class="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-200">
					Mailpit :8025
				</div>
			</div>
		</div>

		<div
			class="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
			>
				<AdminIcon name="HardDrive" class="h-4 w-4" />
			</div>
			<div class="overflow-hidden">
				<div class="text-[11px] font-medium text-zinc-400">Object Storage</div>
				<div class="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-200">
					MinIO S3 :9001
				</div>
			</div>
		</div>
	</div>

	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<a
			href="/admin/user"
			class="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
		>
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Users</span>
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-rose-500 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400"
				>
					<AdminIcon name="Users" class="h-4 w-4" />
				</div>
			</div>
			<div class="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white">
				{data.stats.users}
			</div>
			<div class="mt-2 flex items-center gap-1 text-xs text-zinc-400">
				<span>Manage accounts & roles</span>
				<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
			</div>
		</a>

		<a
			href="/admin/task"
			class="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
		>
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tasks</span>
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-rose-500 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400"
				>
					<AdminIcon name="SquareCheckBig" class="h-4 w-4" />
				</div>
			</div>
			<div class="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white">
				{data.stats.tasks}
			</div>
			<div class="mt-2 flex items-center gap-1 text-xs text-zinc-400">
				<span>View tasks & priorities</span>
				<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
			</div>
		</a>

		<a
			href="/admin/post"
			class="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
		>
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">CMS Posts</span>
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-rose-500 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400"
				>
					<AdminIcon name="FileText" class="h-4 w-4" />
				</div>
			</div>
			<div class="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white">
				{data.stats.posts}
			</div>
			<div class="mt-2 flex items-center gap-1 text-xs text-zinc-400">
				<span>Manage blog posts</span>
				<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
			</div>
		</a>

		<a
			href="/admin/category"
			class="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
		>
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Categories</span>
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-rose-500 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400"
				>
					<AdminIcon name="Folder" class="h-4 w-4" />
				</div>
			</div>
			<div class="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white">
				{data.stats.categories}
			</div>
			<div class="mt-2 flex items-center gap-1 text-xs text-zinc-400">
				<span>Organize taxonomies</span>
				<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
			</div>
		</a>
	</div>

	<!-- Recent Records Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Recent Tasks -->
		<div
			class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
					<AdminIcon name="SquareCheckBig" class="h-4 w-4 text-rose-500" />
					<span>Recent Tasks</span>
				</h2>
				<a href="/admin/task" class="text-xs font-medium text-rose-500 hover:text-rose-600"
					>View all</a
				>
			</div>
			{#if data.recentTasks.length === 0}
				<div class="py-8 text-center text-xs text-zinc-400">No tasks created yet.</div>
			{:else}
				<div class="divide-y divide-zinc-100 dark:divide-zinc-800">
					{#each data.recentTasks as item (item.id)}
						<div class="flex items-center justify-between py-3 text-xs">
							<div class="truncate pr-4 font-medium text-zinc-800 dark:text-zinc-200">
								{item.title}
							</div>
							<div class="flex shrink-0 items-center gap-2">
								<span
									class="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 uppercase dark:bg-zinc-800 dark:text-zinc-400"
								>
									{item.status || 'todo'}
								</span>
								<a
									href="/admin/task/{item.id}"
									class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
								>
									<AdminIcon name="Edit" class="h-3.5 w-3.5" />
								</a>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Recent Posts -->
		<div
			class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
					<AdminIcon name="FileText" class="h-4 w-4 text-rose-500" />
					<span>Recent CMS Posts</span>
				</h2>
				<a href="/admin/post" class="text-xs font-medium text-rose-500 hover:text-rose-600"
					>View all</a
				>
			</div>
			{#if data.recentPosts.length === 0}
				<div class="py-8 text-center text-xs text-zinc-400">No posts published yet.</div>
			{:else}
				<div class="divide-y divide-zinc-100 dark:divide-zinc-800">
					{#each data.recentPosts as item (item.id)}
						<div class="flex items-center justify-between py-3 text-xs">
							<div class="truncate pr-4 font-medium text-zinc-800 dark:text-zinc-200">
								{item.title}
							</div>
							<div class="flex shrink-0 items-center gap-2">
								<span
									class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase {item.published
										? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
										: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}"
								>
									{item.published ? 'Published' : 'Draft'}
								</span>
								<a
									href="/admin/post/{item.id}"
									class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
								>
									<AdminIcon name="Edit" class="h-3.5 w-3.5" />
								</a>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
