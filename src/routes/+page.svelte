<script lang="ts">
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';
</script>

<svelte:head>
	<title>Sangria � The Batteries-Included SvelteKit Framework</title>
</svelte:head>

<div
	class="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-rose-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100"
>
	<!-- Navigation -->
	<header
		class="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/70"
	>
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
			<div class="flex items-center gap-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20"
				>
					<span class="text-base font-black">S</span>
				</div>
				<span class="text-lg font-extrabold tracking-tight">Sangria</span>
			</div>

			<div class="flex items-center gap-3">
				<a
					href="/admin"
					class="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-500/20 transition-all hover:from-rose-600 hover:to-amber-600"
				>
					<span>Open /admin</span>
					<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
				</a>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<main class="mx-auto max-w-6xl space-y-8 px-6 py-20 text-center">
		<div
			class="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
		>
			<span class="h-2 w-2 animate-ping rounded-full bg-rose-500"></span>
			<span>Free & Open Source Batteries-Included Framework for Solo Web Devs</span>
		</div>

		<h1
			class="mx-auto max-w-4xl text-4xl leading-[1.1] font-black tracking-tight text-zinc-900 sm:text-6xl dark:text-white"
		>
			Django's batteries.<br />
			Nuxt's modular DX.<br />
			<span
				class="bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 bg-clip-text text-transparent"
			>
				Powered by SvelteKit & Svelte 5.
			</span>
		</h1>

		<p class="mx-auto max-w-2xl text-base font-normal text-zinc-600 sm:text-lg dark:text-zinc-400">
			The all-in-one web framework designed for solo developers. Auto-generated <code
				class="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-rose-500 dark:bg-zinc-800"
				>/admin</code
			>, PostgreSQL 18, Drizzle ORM, Better-Auth, pg-boss background jobs, Mailpit email testing,
			and S3 storage with Podman.
		</p>

		<div class="flex flex-wrap items-center justify-center gap-4 pt-4">
			<a
				href="/admin"
				class="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
			>
				<AdminIcon name="LayoutDashboard" class="h-4 w-4" />
				<span>Launch Admin Portal</span>
			</a>
			<a
				href="http://localhost:8025"
				target="_blank"
				rel="noreferrer"
				class="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-bold text-zinc-800 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
			>
				<AdminIcon name="Mail" class="h-4 w-4" />
				<span>Mailpit Inbox (:8025)</span>
			</a>
		</div>

		<!-- CLI Command Pill -->
		<div class="pt-6">
			<div
				class="inline-flex items-center gap-3 rounded-xl bg-zinc-900 px-4 py-2.5 font-mono text-xs text-zinc-100 shadow-md dark:border dark:border-zinc-800 dark:bg-zinc-900/90"
			>
				<span class="text-rose-400">$</span>
				<span>pnpm sangria createsuperuser</span>
			</div>
		</div>

		<!-- Batteries Feature Grid -->
		<div class="grid grid-cols-1 gap-6 pt-16 text-left md:grid-cols-2 lg:grid-cols-3">
			<div
				class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-950/40"
				>
					<AdminIcon name="LayoutDashboard" class="h-5 w-5" />
				</div>
				<h3 class="text-base font-bold text-zinc-900 dark:text-white">Auto-Introspecting /admin</h3>
				<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
					Instantly generates data tables, dynamic search, multi-column sorting, pagination, and
					Superforms CRUD modals from your Drizzle schemas.
				</p>
			</div>

			<div
				class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40"
				>
					<AdminIcon name="ShieldCheck" class="h-5 w-5" />
				</div>
				<h3 class="text-base font-bold text-zinc-900 dark:text-white">Better-Auth & RBAC</h3>
				<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
					Production-grade authentication with email/password, social OAuth, role-based access
					control, session cookies, and interactive CLI superuser generator.
				</p>
			</div>

			<div
				class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/40"
				>
					<AdminIcon name="Database" class="h-5 w-5" />
				</div>
				<h3 class="text-base font-bold text-zinc-900 dark:text-white">PostgreSQL 18 & Drizzle</h3>
				<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
					End-to-end TypeScript safety with Drizzle ORM, Drizzle Kit migrations, automated Zod
					validation, and relational queries.
				</p>
			</div>

			<div
				class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-950/40"
				>
					<AdminIcon name="Cpu" class="h-5 w-5" />
				</div>
				<h3 class="text-base font-bold text-zinc-900 dark:text-white">pg-boss Queue Engine</h3>
				<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
					PostgreSQL-backed background job processing, delayed scheduling, automatic retries, and a
					dedicated admin monitor.
				</p>
			</div>

			<div
				class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/40"
				>
					<AdminIcon name="Mail" class="h-5 w-5" />
				</div>
				<h3 class="text-base font-bold text-zinc-900 dark:text-white">
					Transactional Email & Mailpit
				</h3>
				<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
					Svelte-rendered email components with Nodemailer and zero-config local email inspection on
					port 8025 via Mailpit.
				</p>
			</div>

			<div
				class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 dark:bg-cyan-950/40"
				>
					<AdminIcon name="HardDrive" class="h-5 w-5" />
				</div>
				<h3 class="text-base font-bold text-zinc-900 dark:text-white">S3 & MinIO Object Storage</h3>
				<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
					Direct browser-to-S3 presigned uploads, media asset browsing, and seamless switching
					between local MinIO and Cloudflare R2 / AWS S3.
				</p>
			</div>
		</div>
	</main>
</div>
