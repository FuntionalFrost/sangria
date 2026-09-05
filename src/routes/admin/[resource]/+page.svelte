<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let searchQuery = $state(untrack(() => data.query.search || ''));
	let selectedIds = $state(new Set<string>());

	function toggleSelectAll() {
		if (selectedIds.size === data.data.items.length) {
			selectedIds.clear();
		} else {
			for (const item of data.data.items) {
				selectedIds.add(String(item[data.resource.primaryKey]));
			}
		}
	}

	function toggleSelectRow(id: string) {
		if (selectedIds.has(id)) {
			selectedIds.delete(id);
		} else {
			selectedIds.add(id);
		}
	}

	function exportToCSV() {
		const itemsToExport =
			selectedIds.size > 0
				? data.data.items.filter((item) => selectedIds.has(String(item[data.resource.primaryKey])))
				: data.data.items;

		if (itemsToExport.length === 0) {
			toast.error('No items to export');
			return;
		}

		const cols = data.resource.list.columns || Object.keys(data.resource.fields);
		const headers = cols.map((c) => data.resource.fields[c]?.label || c);
		const rows = [headers.join(',')];

		for (const item of itemsToExport) {
			const row = cols.map((c) => {
				const val = item[c];
				const str = val === null || val === undefined ? '' : String(val).replace(/"/g, '""');
				return `"${str}"`;
			});
			rows.push(row.join(','));
		}

		const csvData = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
		const link = document.createElement('a');
		link.setAttribute('href', csvData);
		link.setAttribute(
			'download',
			`${data.resource.name}_export_${new Date().toISOString().slice(0, 10)}.csv`
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success(`Exported ${itemsToExport.length} records to CSV`);
	}

	function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		const url = new URL(page.url);
		if (searchQuery.trim()) {
			url.searchParams.set('search', searchQuery.trim());
		} else {
			url.searchParams.delete('search');
		}
		url.searchParams.set('page', '1');
		goto(url.toString());
	}

	function handleSort(colName: string) {
		const url = new URL(page.url);
		const currentSort = url.searchParams.get('sort');
		const currentOrder = url.searchParams.get('order') || 'desc';

		if (currentSort === colName) {
			url.searchParams.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
		} else {
			url.searchParams.set('sort', colName);
			url.searchParams.set('order', 'asc');
		}
		goto(url.toString());
	}

	function handlePage(newPage: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(newPage));
		goto(url.toString());
	}

	function formatCellValue(val: unknown, fieldName: string, _fieldConfig?: any): string {
		if (val === null || val === undefined) return '—';
		if (typeof val === 'boolean') return val ? 'Yes' : 'No';
		if (val instanceof Date)
			return (
				val.toLocaleDateString() +
				' ' +
				val.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			);
		if (
			typeof val === 'string' &&
			(fieldName.includes('At') || fieldName.includes('date') || fieldName.includes('Date'))
		) {
			const d = new Date(val);
			if (!isNaN(d.getTime())) return d.toLocaleDateString();
		}
		if (typeof val === 'object') return JSON.stringify(val);
		return String(val);
	}
</script>

<svelte:head>
	<title>{data.resource.label} - Sangria Admin</title>
</svelte:head>

{#key data.resource.name}
	<div class="space-y-6">
		{#if data.dbError}
			<div
				class="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
			>
				<AdminIcon name="AlertTriangle" class="h-5 w-5 shrink-0 text-amber-500" />
				<div>
					<div class="font-bold">Database Notice</div>
					<div class="mt-0.5">{data.dbError}</div>
				</div>
			</div>
		{/if}

		<!-- Page Header -->
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1
					class="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
				>
					<AdminIcon name={data.resource.icon} class="h-6 w-6 text-rose-500" />
					<span>{data.resource.label}</span>
				</h1>
				<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
					Showing {data.data.items.length} of {data.data.total} total {data.resource.label.toLowerCase()}
				</p>
			</div>

			<div>
				<a
					href="/admin/{data.resource.name}/new"
					class="flex cursor-pointer items-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-rose-500/20 transition-all hover:bg-rose-600"
				>
					<AdminIcon name="Plus" class="h-4 w-4" />
					<span>Create {data.resource.singularLabel}</span>
				</a>
			</div>
		</div>

		<!-- Funnel & Search Toolbar -->
		<div
			class="flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900"
		>
			<form onsubmit={handleSearch} class="relative max-w-md flex-1">
				<AdminIcon
					name="Search"
					class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search {data.resource.label.toLowerCase()}..."
					class="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-4 pl-9 text-xs text-zinc-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
				/>
			</form>

			<div class="flex items-center gap-2">
				{#if data.query.search}
					<button
						type="button"
						onclick={() => {
							searchQuery = '';
							const url = new URL(page.url);
							url.searchParams.delete('search');
							goto(url.toString());
						}}
						class="mr-2 flex cursor-pointer items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
					>
						<AdminIcon name="X" class="h-3.5 w-3.5" />
						<span>Clear search</span>
					</button>
				{/if}

				<button
					type="button"
					onclick={exportToCSV}
					class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-xs transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
					title="Export to CSV"
				>
					<AdminIcon name="Download" class="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
					<span>Export CSV {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}</span>
				</button>

				{#if selectedIds.size > 0}
					<form
						method="POST"
						action="?/bulkDelete"
						use:enhance={() => {
							return async ({ result, update }) => {
								if (result.type === 'success') {
									toast.success(`Deleted ${selectedIds.size} records`);
									selectedIds.clear();
								}
								await update();
							};
						}}
					>
						<input type="hidden" name="ids" value={JSON.stringify(Array.from(selectedIds))} />
						<button
							type="submit"
							onclick={(e) => {
								if (
									!confirm(
										`Are you sure you want to delete ${selectedIds.size} selected record(s)?`
									)
								) {
									e.preventDefault();
								}
							}}
							class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-500 hover:text-white dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
						>
							<AdminIcon name="Trash2" class="h-3.5 w-3.5" />
							<span>Delete Selected ({selectedIds.size})</span>
						</button>
					</form>
				{/if}
			</div>
		</div>

		<!-- Data Table -->
		<div
			class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="overflow-x-auto">
				<table class="w-full border-collapse text-left">
					<thead>
						<tr
							class="border-b border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-800/40"
						>
							<th class="w-10 px-4 py-3">
								<input
									type="checkbox"
									checked={data.data.items.length > 0 &&
										selectedIds.size === data.data.items.length}
									onchange={toggleSelectAll}
									class="h-4 w-4 cursor-pointer rounded border-zinc-300 text-rose-500 focus:ring-rose-500/20 dark:border-zinc-700 dark:bg-zinc-800"
								/>
							</th>
							{#each data.resource.list.columns || [] as colName (colName)}
								{@const field = data.resource.fields[colName]}
								{@const isSorted = data.query.sort === colName}
								<th class="px-4 py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
									<button
										type="button"
										onclick={() => handleSort(colName)}
										class="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-rose-500"
									>
										<span>{field?.label || colName}</span>
										<AdminIcon
											name="ArrowUpDown"
											class="h-3 w-3 {isSorted ? 'text-rose-500' : 'text-zinc-400 opacity-40'}"
										/>
									</button>
								</th>
							{/each}
							<th
								class="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-zinc-100 text-xs dark:divide-zinc-800">
						{#if data.data.items.length === 0}
							<tr>
								<td
									colspan={(data.resource.list.columns?.length || 0) + 2}
									class="py-12 text-center text-zinc-400"
								>
									No records found.
								</td>
							</tr>
						{:else}
							{#each data.data.items as item (item[data.resource.primaryKey])}
								{@const id = String(item[data.resource.primaryKey])}
								<tr
									class="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 {selectedIds.has(
										id
									)
										? 'bg-rose-50/40 dark:bg-rose-950/20'
										: ''}"
								>
									<td class="w-10 px-4 py-3">
										<input
											type="checkbox"
											checked={selectedIds.has(id)}
											onchange={() => toggleSelectRow(id)}
											class="h-4 w-4 cursor-pointer rounded border-zinc-300 text-rose-500 focus:ring-rose-500/20 dark:border-zinc-700 dark:bg-zinc-800"
										/>
									</td>
									{#each data.resource.list.columns || [] as colName (colName)}
										{@const val = item[colName]}
										{@const field = data.resource.fields[colName]}
										<td class="px-4 py-3 text-zinc-800 dark:text-zinc-200">
											{#if typeof val === 'boolean'}
												<span
													class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold {val
														? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
														: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}"
												>
													<AdminIcon name={val ? 'Check' : 'X'} class="h-3 w-3" />
													<span>{val ? 'Yes' : 'No'}</span>
												</span>
											{:else if colName === 'role'}
												<span
													class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase {val ===
													'superadmin'
														? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
														: val === 'admin'
															? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
															: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}"
												>
													{val}
												</span>
											{:else if colName === 'status'}
												<span
													class="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 uppercase dark:bg-zinc-800 dark:text-zinc-400"
												>
													{val || 'todo'}
												</span>
											{:else if colName === data.resource.primaryKey}
												<a
													href="/admin/{data.resource.name}/{id}"
													class="font-mono font-medium text-rose-500 hover:text-rose-600"
												>
													#{String(val).slice(0, 8)}
												</a>
											{:else}
												<span class="block max-w-xs truncate"
													>{formatCellValue(val, colName, field)}</span
												>
											{/if}
										</td>
									{/each}
									<td class="px-4 py-3 text-right">
										<div class="flex items-center justify-end gap-1.5">
											<a
												href="/admin/{data.resource.name}/{id}"
												class="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
												title="Edit Record"
											>
												<AdminIcon name="Edit" class="h-4 w-4" />
											</a>
											<form
												method="POST"
												action="?/delete"
												use:enhance={() => {
													return async ({ result, update }) => {
														if (result.type === 'success') {
															toast.success('Record deleted successfully');
														}
														await update();
													};
												}}
											>
												<input type="hidden" name="id" value={id} />
												<button
													type="submit"
													onclick={(e) => {
														if (!confirm('Are you sure you want to delete this record?')) {
															e.preventDefault();
														}
													}}
													class="cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
													title="Delete Record"
												>
													<AdminIcon name="Trash2" class="h-4 w-4" />
												</button>
											</form>
										</div>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>

			<!-- Pagination Footer -->
			{#if data.data.totalPages > 1}
				<div
					class="flex items-center justify-between border-t border-zinc-200 p-4 text-xs text-zinc-500 dark:border-zinc-800"
				>
					<div>
						Page {data.data.page} of {data.data.totalPages}
					</div>
					<div class="flex items-center gap-1.5">
						<button
							type="button"
							disabled={data.data.page <= 1}
							onclick={() => handlePage(data.data.page - 1)}
							class="flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
						>
							<AdminIcon name="ChevronLeft" class="h-3.5 w-3.5" />
							<span>Previous</span>
						</button>
						<button
							type="button"
							disabled={data.data.page >= data.data.totalPages}
							onclick={() => handlePage(data.data.page + 1)}
							class="flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
						>
							<span>Next</span>
							<AdminIcon name="ChevronRight" class="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/key}
