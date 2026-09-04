<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminIcon from '$lib/components/admin/AdminIcon.svelte';

	let { data, form } = $props();
	let saving = $state(false);

	function formatInputValue(val: unknown, fieldConfig: any): string {
		if (val === null || val === undefined) return '';
		if (fieldConfig.dataType === 'date' && val) {
			const d = new Date(val as any);
			if (!isNaN(d.getTime())) {
				return d.toISOString().slice(0, 16);
			}
		}
		return String(val);
	}
</script>

<svelte:head>
	<title>{data.isNew ? 'Create' : 'Edit'} {data.resource.singularLabel} - Sangria Admin</title>
</svelte:head>

<div class="max-w-3xl space-y-6">
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<a
				href="/admin/{data.resource.name}"
				class="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:text-zinc-200"
			>
				<AdminIcon name="ChevronLeft" class="h-4 w-4" />
			</a>
			<div>
				<h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
					{data.isNew
						? `Create New ${data.resource.singularLabel}`
						: `Edit ${data.resource.singularLabel}`}
				</h1>
				<p class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
					{data.isNew
						? 'Fill in the fields below to create a new record'
						: `ID: ${data.item[data.resource.primaryKey]}`}
				</p>
			</div>
		</div>

		{#if !data.isNew}
			<form
				method="POST"
				action="?/delete"
				onsubmit={(e) => {
					if (
						!confirm(
							`Are you sure you want to delete this ${data.resource.singularLabel.toLowerCase()}?`
						)
					) {
						e.preventDefault();
					}
				}}
			>
				<button
					type="submit"
					class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/30"
				>
					<AdminIcon name="Trash2" class="h-3.5 w-3.5" />
					<span>Delete</span>
				</button>
			</form>
		{/if}
	</div>

	{#if form?.error}
		<div
			class="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
		>
			<AdminIcon name="X" class="h-4 w-4 shrink-0" />
			<span>{form.error}</span>
		</div>
	{/if}

	<!-- Form Card -->
	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				saving = false;
				await update();
			};
		}}
		class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
	>
		{#each Object.entries(data.resource.fields) as [fieldName, field] (fieldName)}
			{#if !field.hidden}
				{@const currentValue = data.item[fieldName]}
				<div>
					<label
						for={fieldName}
						class="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
					>
						{field.label || fieldName}
						{#if field.required}
							<span class="text-rose-500">*</span>
						{/if}
					</label>

					{#if field.readonly && !data.isNew}
						<input
							type="text"
							id={fieldName}
							name={fieldName}
							value={formatInputValue(currentValue, field)}
							readonly
							class="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-zinc-100/70 px-3.5 py-2.5 font-mono text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50"
						/>
					{:else if field.widget === 'textarea'}
						<textarea
							id={fieldName}
							name={fieldName}
							rows="4"
							required={field.required}
							placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
							class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
							>{formatInputValue(currentValue, field)}</textarea
						>
					{:else if field.widget === 'select' && field.options}
						<select
							id={fieldName}
							name={fieldName}
							required={field.required}
							class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
						>
							{#each field.options as opt (typeof opt === 'object' ? opt.value : opt)}
								{@const optVal = typeof opt === 'object' ? opt.value : opt}
								{@const optLabel = typeof opt === 'object' ? opt.label : String(opt)}
								<option value={optVal} selected={String(currentValue) === String(optVal)}>
									{optLabel}
								</option>
							{/each}
						</select>
					{:else if field.widget === 'switch' || field.dataType === 'boolean'}
						<label class="relative inline-flex cursor-pointer items-center gap-3">
							<input
								type="checkbox"
								id={fieldName}
								name={fieldName}
								checked={Boolean(currentValue)}
								class="h-4 w-4 rounded border-zinc-300 text-rose-500 focus:ring-rose-500/20 dark:border-zinc-700 dark:bg-zinc-800"
							/>
							<span class="text-xs text-zinc-600 dark:text-zinc-400">
								{currentValue ? 'Enabled' : 'Disabled'}
							</span>
						</label>
					{:else if field.widget === 'datetime' || field.dataType === 'date'}
						<input
							type="datetime-local"
							id={fieldName}
							name={fieldName}
							value={formatInputValue(currentValue, field)}
							required={field.required}
							class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
						/>
					{:else if field.widget === 'number' || field.dataType === 'number'}
						<input
							type="number"
							id={fieldName}
							name={fieldName}
							value={formatInputValue(currentValue, field)}
							required={field.required}
							placeholder={field.placeholder}
							class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
						/>
					{:else}
						<input
							type="text"
							id={fieldName}
							name={fieldName}
							value={formatInputValue(currentValue, field)}
							required={field.required}
							placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
							class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
						/>
					{/if}

					{#if field.helpText}
						<p class="mt-1 text-[11px] text-zinc-400">{field.helpText}</p>
					{/if}
				</div>
			{/if}
		{/each}

		<div
			class="flex items-center justify-end gap-2.5 border-t border-zinc-100 pt-4 dark:border-zinc-800"
		>
			<a
				href="/admin/{data.resource.name}"
				class="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
			>
				Cancel
			</a>
			<button
				type="submit"
				disabled={saving}
				class="flex cursor-pointer items-center gap-2 rounded-lg bg-rose-500 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-rose-500/20 transition-all hover:bg-rose-600 disabled:opacity-50"
			>
				{#if saving}
					<AdminIcon name="RefreshCw" class="h-3.5 w-3.5 animate-spin" />
					<span>Saving...</span>
				{:else}
					<AdminIcon name="Check" class="h-3.5 w-3.5" />
					<span>{data.isNew ? 'Create Record' : 'Save Changes'}</span>
				{/if}
			</button>
		</div>
	</form>
</div>
