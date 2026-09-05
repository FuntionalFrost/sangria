<script lang="ts">
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';
	import SangriaLogo from '$lib/components/SangriaLogo.svelte';
	import { toggleMode, mode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';

	type TabType = 'schema' | 'resource' | 'cli' | 'queue';
	let activeTab = $state<TabType>('resource');
	let copiedCli = $state(false);

	async function copyCliCommand() {
		try {
			await navigator.clipboard.writeText('pnpm sangria createsuperuser');
			copiedCli = true;
			toast.success('CLI command copied to clipboard!');
			setTimeout(() => {
				copiedCli = false;
			}, 2000);
		} catch {
			toast.error('Failed to copy to clipboard');
		}
	}
</script>

<svelte:head>
	<title>Sangria - The Batteries-Included SvelteKit Meta-Framework</title>
	<meta
		name="description"
		content="The Batteries-Included SvelteKit Framework for Solo Web Developers. Auto-generated /admin, Better-Auth, Drizzle ORM, pg-boss background jobs, Mailpit email, and MinIO storage."
	/>
</svelte:head>

<div
	class="relative min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-rose-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100"
>
	<!-- Ambient Background Glow Gradients -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute -top-40 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full bg-linear-to-tr from-rose-500/20 via-amber-500/15 to-purple-600/20 opacity-70 blur-3xl dark:opacity-40"
		></div>
	</div>

	<!-- Navigation -->
	<header
		class="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70"
	>
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
			<a href="/" class="flex items-center gap-3">
				<SangriaLogo size={34} />
				<span class="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Sangria</span>
			</a>

			<!-- svelte.dev style navigation items -->
			<nav
				class="hidden items-center gap-6 text-sm font-semibold text-zinc-600 md:flex dark:text-zinc-400"
			>
				<a href="#batteries" class="transition-colors hover:text-rose-500 dark:hover:text-rose-400"
					>Batteries</a
				>
				<a href="#showcase" class="transition-colors hover:text-rose-500 dark:hover:text-rose-400"
					>Showcase</a
				>
				<a href="#quickstart" class="transition-colors hover:text-rose-500 dark:hover:text-rose-400"
					>Quickstart</a
				>
			</nav>

			<div class="flex items-center gap-3">
				<a
					href="https://github.com/FuntionalFrost/sangria"
					target="_blank"
					rel="noreferrer"
					class="hidden items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-zinc-700 shadow-2xs transition-all hover:bg-zinc-50 sm:flex dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
				>
					<AdminIcon name="ExternalLink" class="h-3.5 w-3.5 text-zinc-400" />
					<span>GitHub</span>
				</a>

				<button
					type="button"
					onclick={() => toggleMode()}
					class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-2xs transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
					title="Toggle Theme ({mode.current || 'system'})"
					aria-label="Toggle theme"
				>
					{#if mode.current === 'dark'}
						<AdminIcon name="Sun" class="h-4 w-4 text-amber-400" />
					{:else}
						<AdminIcon name="Moon" class="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
					{/if}
				</button>

				<a
					href="/admin"
					class="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-rose-500 via-rose-600 to-amber-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition-all hover:brightness-110"
				>
					<span>Open /admin</span>
					<AdminIcon name="ChevronRight" class="h-4 w-4" />
				</a>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<main class="relative mx-auto max-w-6xl space-y-12 px-6 pt-16 pb-24 text-center">
		<!-- svelte.dev-style Definition Blurb -->
		<div class="mx-auto max-w-xl text-left">
			<div
				class="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-4.5 shadow-sm backdrop-blur-xl transition-all hover:border-rose-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/70"
			>
				<div
					class="flex items-center justify-between font-mono text-sm text-zinc-500 dark:text-zinc-400"
				>
					<div class="flex items-center gap-2">
						<span class="text-base font-extrabold text-rose-500">san·gri·a</span>
						<span class="text-zinc-400 dark:text-zinc-500">/san-gree-uh/</span>
						<span
							class="rounded-md bg-rose-500/10 px-2 py-0.5 font-sans text-xs font-semibold text-rose-600 dark:text-rose-400"
							>noun</span
						>
					</div>
					<span class="font-sans text-xs font-bold tracking-wider text-zinc-400 uppercase"
						>Meta-Framework</span
					>
				</div>
				<div
					class="mt-2.5 space-y-1 font-sans text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
				>
					<p>
						<strong class="text-zinc-900 dark:text-white">1.</strong> A rich, refreshing blend of full-stack
						developer tools.
					</p>
					<p>
						<strong class="text-zinc-900 dark:text-white">2.</strong> The batteries-included framework
						for solo SvelteKit developers who ship fast.
					</p>
				</div>
			</div>
		</div>

		<!-- Main Headline -->
		<h1
			class="mx-auto max-w-4xl text-4xl leading-[1.08] font-black tracking-tight text-zinc-900 sm:text-6xl md:text-7xl dark:text-white"
		>
			<span class="font-black text-emerald-800 dark:text-emerald-500">Django's batteries.</span><br
			/>
			<span class="font-black text-lime-500 dark:text-lime-400">Nuxt's modular DX.</span><br />
			<span
				class="bg-linear-to-r from-orange-500 via-rose-500 to-amber-500 bg-clip-text text-transparent"
			>
				Powered by Svelte 5 Runes.
			</span>
		</h1>

		<!-- Subheading -->
		<p
			class="mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400"
		>
			Stop rebuilding auth, admin UI, queues, email, and storage on every SvelteKit project. Sangria
			gives you an auto-introspecting <code
				class="rounded bg-rose-500/10 px-2 py-0.5 font-mono font-semibold text-rose-500"
				>/admin</code
			>, PostgreSQL 18, Drizzle ORM, Better-Auth, and Podman containers in one command.
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-wrap items-center justify-center gap-4 pt-2">
			<a
				href="/admin"
				class="flex items-center gap-2.5 rounded-xl bg-linear-to-r from-rose-500 to-amber-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-500/25 transition-all hover:scale-[1.02] hover:brightness-110"
			>
				<AdminIcon name="LayoutDashboard" class="h-4 w-4" />
				<span>Launch Admin Dashboard</span>
			</a>
			<a
				href="http://localhost:8025"
				target="_blank"
				rel="noreferrer"
				class="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-bold text-zinc-800 shadow-2xs transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
			>
				<AdminIcon name="Mail" class="h-4 w-4 text-amber-500" />
				<span>Mailpit Inbox (:8025)</span>
			</a>
		</div>

		<!-- CLI Copy Box -->
		<div class="pt-2">
			<button
				type="button"
				onclick={copyCliCommand}
				class="group relative inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-950 px-5 py-3 font-mono text-sm text-zinc-100 shadow-xl transition-all hover:border-rose-500/50"
				title="Click to copy CLI command"
			>
				<span class="font-bold text-rose-400">$</span>
				<span>pnpm sangria createsuperuser</span>
				<span
					class="ml-2 flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400 transition-colors group-hover:text-white"
				>
					<AdminIcon name={copiedCli ? 'Check' : 'Copy'} class="h-3.5 w-3.5" />
					<span>{copiedCli ? 'Copied!' : 'Copy'}</span>
				</span>
			</button>
		</div>

		<!-- Interactive Code Playground Showcase -->
		<div id="showcase" class="pt-12 text-left">
			<div
				class="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 shadow-2xl dark:border-zinc-800"
			>
				<!-- Window Titlebar & Tab Bar -->
				<div
					class="flex flex-col border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
				>
					<!-- Window Controls -->
					<div class="mb-3 flex items-center gap-2 sm:mb-0">
						<span class="h-3 w-3 rounded-full bg-rose-500/80"></span>
						<span class="h-3 w-3 rounded-full bg-amber-500/80"></span>
						<span class="h-3 w-3 rounded-full bg-emerald-500/80"></span>
						<span class="ml-2 font-mono text-xs text-zinc-500">sangria.config.ts</span>
					</div>

					<!-- Tabs -->
					<div class="flex flex-wrap items-center gap-1.5">
						<button
							type="button"
							onclick={() => (activeTab = 'resource')}
							class="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors {activeTab ===
							'resource'
								? 'bg-rose-500 text-white'
								: 'text-zinc-400 hover:text-white'}"
						>
							1. Admin Resource
						</button>
						<button
							type="button"
							onclick={() => (activeTab = 'schema')}
							class="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors {activeTab ===
							'schema'
								? 'bg-rose-500 text-white'
								: 'text-zinc-400 hover:text-white'}"
						>
							2. Drizzle Schema
						</button>
						<button
							type="button"
							onclick={() => (activeTab = 'cli')}
							class="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors {activeTab ===
							'cli'
								? 'bg-rose-500 text-white'
								: 'text-zinc-400 hover:text-white'}"
						>
							3. Interactive CLI
						</button>
						<button
							type="button"
							onclick={() => (activeTab = 'queue')}
							class="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors {activeTab ===
							'queue'
								? 'bg-rose-500 text-white'
								: 'text-zinc-400 hover:text-white'}"
						>
							4. Background Worker
						</button>
					</div>
				</div>

				<!-- Code Content Window -->
				<div class="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-zinc-300">
					{#if activeTab === 'resource'}
						<pre class="text-zinc-300"><code
								><span class="text-rose-400">import</span> &#123; defineResource &#125; <span
									class="text-rose-400">from</span
								> <span class="text-amber-300">'$lib/sangria'</span>;
<span class="text-rose-400">import</span> &#123; task &#125; <span class="text-rose-400">from</span
								> <span class="text-amber-300">'$lib/server/db/schema'</span>;

<span class="text-purple-400">export const</span> taskResource = <span class="text-blue-400"
									>defineResource</span
								>(task, &#123;
  name: <span class="text-amber-300">'task'</span>,
  label: <span class="text-amber-300">'Tasks'</span>,
  icon: <span class="text-amber-300">'SquareCheckBig'</span>,
  list: &#123;
    columns: [<span class="text-amber-300">'id'</span>, <span class="text-amber-300">'title'</span
								>, <span class="text-amber-300">'status'</span>, <span class="text-amber-300"
									>'priority'</span
								>, <span class="text-amber-300">'createdAt'</span>],
    searchable: [<span class="text-amber-300">'title'</span>, <span class="text-amber-300"
									>'description'</span
								>],
    Funnelable: [<span class="text-amber-300">'status'</span>, <span class="text-amber-300"
									>'priority'</span
								>],
    sortable: [<span class="text-amber-300">'id'</span>, <span class="text-amber-300">'title'</span
								>, <span class="text-amber-300">'createdAt'</span>]
  &#125;,
  permissions: &#123;
    create: (user) =&gt; user?.role === <span class="text-amber-300">'admin'</span
								> || user?.role === <span class="text-amber-300">'superadmin'</span>
  &#125;
&#125;);</code
							></pre>
					{:else if activeTab === 'schema'}
						<pre class="text-zinc-300"><code
								><span class="text-rose-400">import</span
								> &#123; pgTable, serial, text, integer, timestamp &#125; <span
									class="text-rose-400">from</span
								> <span class="text-amber-300">'drizzle-orm/pg-core'</span>;

<span class="text-purple-400">export const</span> task = <span class="text-blue-400">pgTable</span
								>(<span class="text-amber-300">'task'</span>, &#123;
  id: <span class="text-blue-400">serial</span>(<span class="text-amber-300">'id'</span>).<span
									class="text-blue-400">primaryKey</span
								>(),
  title: <span class="text-blue-400">text</span>(<span class="text-amber-300">'title'</span>).<span
									class="text-blue-400">notNull</span
								>(),
  description: <span class="text-blue-400">text</span>(<span class="text-amber-300"
									>'description'</span
								>),
  status: <span class="text-blue-400">text</span>(<span class="text-amber-300">'status'</span
								>).<span class="text-blue-400">default</span>(<span class="text-amber-300"
									>'todo'</span
								>).<span class="text-blue-400">notNull</span>(),
  priority: <span class="text-blue-400">integer</span>(<span class="text-amber-300">'priority'</span
								>).<span class="text-blue-400">default</span>(1).<span class="text-blue-400"
									>notNull</span
								>(),
  createdAt: <span class="text-blue-400">timestamp</span>(<span class="text-amber-300"
									>'created_at'</span
								>).<span class="text-blue-400">defaultNow</span>().<span class="text-blue-400"
									>notNull</span
								>()
&#125;);</code
							></pre>
					{:else if activeTab === 'cli'}
						<pre class="text-zinc-300"><code
								><span class="text-zinc-500"># 1. Start Infrastructure Stack</span>
<span class="text-rose-400">$</span> podman compose up -d

<span class="text-zinc-500"># 2. Push Database Migrations</span>
<span class="text-rose-400">$</span> pnpm db:push

<span class="text-zinc-500"># 3. Create Superadministrator Account</span>
<span class="text-rose-400">$</span> pnpm sangria createsuperuser
<span class="text-emerald-400">✔ Enter admin name:</span> Administrator
<span class="text-emerald-400">✔ Enter admin email:</span> admin@sangria.local
<span class="text-emerald-400">✔ Enter admin password:</span> ••••••••••••
<span class="text-amber-300">★ Superuser created successfully! Log in at /admin</span></code
							></pre>
					{:else if activeTab === 'queue'}
						<pre class="text-zinc-300"><code
								><span class="text-rose-400">import</span> &#123; JobQueue &#125; <span
									class="text-rose-400">from</span
								> <span class="text-amber-300">'$lib/sangria'</span>;

<span class="text-zinc-500">// Enqueue background job in SvelteKit server action</span>
<span class="text-rose-400">await</span> JobQueue.<span class="text-blue-400">dispatch</span>(<span
									class="text-amber-300">'send-welcome-email'</span
								>, &#123;
  to: <span class="text-amber-300">'user@sangria.local'</span>,
  template: <span class="text-amber-300">'welcome'</span>
&#125;);

<span class="text-zinc-500">// Start CLI worker process to handle jobs in background</span>
<span class="text-rose-400">$</span> pnpm sangria queue:work</code
							></pre>
					{/if}
				</div>
			</div>
		</div>

		<!-- Unified 6 Batteries Included Grid -->
		<div id="batteries" class="pt-16 text-left">
			<div class="mb-10 text-center">
				<div
					class="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1 font-mono text-xs font-bold text-rose-600 dark:text-rose-400"
				>
					<span>⚡ FULL-STACK OUT OF THE BOX</span>
				</div>
				<h2
					class="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
				>
					The 6 Batteries Included
				</h2>
				<p class="mx-auto mt-2 max-w-xl text-sm font-medium text-zinc-500 dark:text-zinc-400">
					Built on the modern web stack. Everything you need to ship full-stack web apps without
					assembling 20 npm packages.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<!-- 1. Auto Admin -->
				<a
					href="https://svelte.dev"
					target="_blank"
					rel="noreferrer"
					class="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-rose-500/40 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
				>
					<div class="space-y-3.5">
						<div class="flex items-center justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 dark:bg-rose-950/40"
							>
								<AdminIcon name="LayoutDashboard" class="h-5 w-5" />
							</div>
							<AdminIcon
								name="ExternalLink"
								class="h-4 w-4 text-zinc-400 transition-colors group-hover:text-rose-500"
							/>
						</div>
						<h3 class="text-base font-bold text-zinc-900 dark:text-white">
							Auto-Introspecting /admin
						</h3>
						<p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
							Generates data tables, search, multi-column sorting, bulk row actions, CSV exports,
							and edit modals directly from Drizzle schemas.
						</p>
					</div>
					<div
						class="mt-4 flex items-center gap-1.5 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400"
					>
						<span>svelte.dev</span>
						<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
					</div>
				</a>

				<!-- 2. Better Auth -->
				<a
					href="https://www.better-auth.com"
					target="_blank"
					rel="noreferrer"
					class="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
				>
					<div class="space-y-3.5">
						<div class="flex items-center justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-950/40"
							>
								<AdminIcon name="ShieldCheck" class="h-5 w-5" />
							</div>
							<AdminIcon
								name="ExternalLink"
								class="h-4 w-4 text-zinc-400 transition-colors group-hover:text-emerald-500"
							/>
						</div>
						<h3 class="text-base font-bold text-zinc-900 dark:text-white">Better-Auth & RBAC</h3>
						<p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
							Session cookies, social OAuth providers, role guards in SvelteKit hooks, and
							interactive CLI superuser provisioning.
						</p>
					</div>
					<div
						class="mt-4 flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
					>
						<span>better-auth.com</span>
						<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
					</div>
				</a>

				<!-- 3. Postgres & Drizzle -->
				<a
					href="https://orm.drizzle.team"
					target="_blank"
					rel="noreferrer"
					class="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
				>
					<div class="space-y-3.5">
						<div class="flex items-center justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-950/40"
							>
								<AdminIcon name="Database" class="h-5 w-5" />
							</div>
							<AdminIcon
								name="ExternalLink"
								class="h-4 w-4 text-zinc-400 transition-colors group-hover:text-blue-500"
							/>
						</div>
						<h3 class="text-base font-bold text-zinc-900 dark:text-white">
							PostgreSQL 18 & Drizzle
						</h3>
						<p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
							End-to-end TypeScript safety with Drizzle ORM, Drizzle Kit migrations, Zod validation,
							and relational foreign key dropdowns.
						</p>
					</div>
					<div
						class="mt-4 flex items-center gap-1.5 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400"
					>
						<span>orm.drizzle.team</span>
						<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
					</div>
				</a>

				<!-- 4. pg-boss Queue -->
				<a
					href="https://github.com/timgit/pg-boss"
					target="_blank"
					rel="noreferrer"
					class="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
				>
					<div class="space-y-3.5">
						<div class="flex items-center justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-950/40"
							>
								<AdminIcon name="Cpu" class="h-5 w-5" />
							</div>
							<AdminIcon
								name="ExternalLink"
								class="h-4 w-4 text-zinc-400 transition-colors group-hover:text-purple-500"
							/>
						</div>
						<h3 class="text-base font-bold text-zinc-900 dark:text-white">pg-boss Queue Engine</h3>
						<p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
							PostgreSQL-backed background job queue, worker CLI, retry backoffs, and an admin job
							monitoring interface.
						</p>
					</div>
					<div
						class="mt-4 flex items-center gap-1.5 font-mono text-xs font-semibold text-purple-600 dark:text-purple-400"
					>
						<span>github.com/timgit/pg-boss</span>
						<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
					</div>
				</a>

				<!-- 5. Email & Mailpit -->
				<a
					href="http://localhost:8025"
					target="_blank"
					rel="noreferrer"
					class="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
				>
					<div class="space-y-3.5">
						<div class="flex items-center justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-950/40"
							>
								<AdminIcon name="Mail" class="h-5 w-5" />
							</div>
							<AdminIcon
								name="ExternalLink"
								class="h-4 w-4 text-zinc-400 transition-colors group-hover:text-amber-500"
							/>
						</div>
						<h3 class="text-base font-bold text-zinc-900 dark:text-white">
							Transactional Email & Mailpit
						</h3>
						<p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
							Svelte email templates with Nodemailer transport and zero-config local email
							inspection at port 8025 via Mailpit.
						</p>
					</div>
					<div
						class="mt-4 flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400"
					>
						<span>localhost:8025</span>
						<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
					</div>
				</a>

				<!-- 6. MinIO & S3 -->
				<a
					href="https://min.io"
					target="_blank"
					rel="noreferrer"
					class="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
				>
					<div class="space-y-3.5">
						<div class="flex items-center justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 dark:bg-cyan-950/40"
							>
								<AdminIcon name="HardDrive" class="h-5 w-5" />
							</div>
							<AdminIcon
								name="ExternalLink"
								class="h-4 w-4 text-zinc-400 transition-colors group-hover:text-cyan-500"
							/>
						</div>
						<h3 class="text-base font-bold text-zinc-900 dark:text-white">
							S3 & MinIO Object Storage
						</h3>
						<p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
							Direct pre-signed browser uploads, S3 bucket explorer, and seamless switching between
							local MinIO and Cloudflare R2 / AWS S3.
						</p>
					</div>
					<div
						class="mt-4 flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400"
					>
						<span>min.io</span>
						<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
					</div>
				</a>
			</div>
		</div>

		<!-- 4-Step Quickstart Timeline -->
		<div id="quickstart" class="pt-16 text-left">
			<div
				class="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
			>
				<h3 class="mb-6 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
					⚡ Up & Running in 4 Commands
				</h3>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-4">
					<div class="space-y-2">
						<div class="font-mono text-xs font-bold text-rose-500">01. INFRASTRUCTURE</div>
						<div class="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
							podman compose up -d
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400">
							Starts PostgreSQL 18, Mailpit (:8025), & MinIO S3 (:9001).
						</p>
					</div>

					<div class="space-y-2">
						<div class="font-mono text-xs font-bold text-rose-500">02. MIGRATIONS</div>
						<div class="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
							pnpm db:push
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400">
							Pushes Drizzle schemas directly to PostgreSQL database.
						</p>
					</div>

					<div class="space-y-2">
						<div class="font-mono text-xs font-bold text-rose-500">03. SUPERUSER</div>
						<div class="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
							pnpm sangria createsuperuser
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400">
							Provisions admin account interactively in CLI.
						</p>
					</div>

					<div class="space-y-2">
						<div class="font-mono text-xs font-bold text-rose-500">04. DEVELOP</div>
						<div class="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
							pnpm dev
						</div>
						<p class="text-xs text-zinc-500 dark:text-zinc-400">
							Launch SvelteKit dev server & control panel at /admin.
						</p>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer
		class="border-t border-zinc-200 bg-white py-12 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
	>
		<div
			class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row"
		>
			<div class="flex items-center gap-3">
				<SangriaLogo size={28} />
				<span class="font-bold text-zinc-900 dark:text-white">Sangria Framework © 2026</span>
				<span>— Released under MIT License</span>
			</div>

			<div class="flex items-center gap-6">
				<a href="/admin" class="transition-colors hover:text-rose-500">Admin Portal</a>
				<a
					href="http://localhost:8025"
					target="_blank"
					rel="noreferrer"
					class="transition-colors hover:text-amber-500">Mailpit (:8025)</a
				>
				<a
					href="http://localhost:9001"
					target="_blank"
					rel="noreferrer"
					class="transition-colors hover:text-purple-500">MinIO (:9001)</a
				>
				<a
					href="https://github.com/FuntionalFrost/sangria"
					target="_blank"
					rel="noreferrer"
					class="transition-colors hover:text-zinc-900 dark:hover:text-white">GitHub</a
				>
			</div>
		</div>
	</footer>
</div>
