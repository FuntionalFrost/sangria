import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registry, fetchResourceList, deleteResourceItem } from '$lib/sangria';
import '$lib/server/admin/resources';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const resource = registry.getResource(params.resource);
	if (!resource) {
		throw error(404, `Resource "${params.resource}" not found`);
	}

	if (resource.permissions.view && !resource.permissions.view(locals.user)) {
		throw error(403, 'You do not have permission to view this resource.');
	}

	const search = url.searchParams.get('search') || '';
	const page = Number(url.searchParams.get('page')) || 1;
	const perPage = Number(url.searchParams.get('perPage')) || resource.list.perPage || 20;
	const sort =
		url.searchParams.get('sort') || resource.list.defaultSort?.column || resource.primaryKey;
	const order =
		(url.searchParams.get('order') as 'asc' | 'desc') ||
		resource.list.defaultSort?.direction ||
		'desc';

	// Extract filter query parameters
	const filters: Record<string, string> = {};
	for (const filterKey of resource.list.filterable || []) {
		const val = url.searchParams.get(filterKey);
		if (val !== null && val !== '') {
			filters[filterKey] = val;
		}
	}

	const result = await fetchResourceList(resource, {
		page,
		perPage,
		search,
		sort,
		order,
		filters
	});

	return {
		resource: {
			name: resource.name,
			label: resource.label,
			singularLabel: resource.singularLabel,
			icon: resource.icon,
			primaryKey: resource.primaryKey,
			fields: resource.fields,
			list: resource.list
		},
		data: result,
		query: {
			page,
			perPage,
			search,
			sort,
			order,
			filters
		}
	};
};

export const actions: Actions = {
	delete: async ({ params, request, locals }) => {
		const resource = registry.getResource(params.resource);
		if (!resource) return fail(404, { error: 'Resource not found' });

		if (resource.permissions.delete && !resource.permissions.delete(locals.user)) {
			return fail(403, { error: 'Permission denied' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID is required' });

		try {
			await deleteResourceItem(resource, id);
			return { success: true };
		} catch (err: any) {
			return fail(500, { error: err?.message || 'Failed to delete record' });
		}
	}
};
