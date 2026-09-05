import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import crypto from 'node:crypto';
import {
	registry,
	fetchResourceList,
	fetchResourceItem,
	createResourceItem,
	updateResourceItem,
	deleteResourceItem,
	type FieldConfig
} from '$lib/sangria';
import '$lib/server/admin/resources';

export const load: PageServerLoad = async ({ params, locals }) => {
	const resource = registry.getResource(params.resource);
	if (!resource) throw error(404, `Resource "${params.resource}" not found`);

	const isNew = params.id === 'new';

	if (isNew) {
		if (resource.permissions.create && !resource.permissions.create(locals.user)) {
			throw error(403, 'You do not have permission to create this resource.');
		}
	} else {
		if (resource.permissions.edit && !resource.permissions.edit(locals.user)) {
			throw error(403, 'You do not have permission to edit this resource.');
		}
	}

	const item = isNew ? {} : await fetchResourceItem(resource, params.id);
	if (!isNew && !item) throw error(404, 'Record not found');

	// Populate relational options for fields referencing another resource
	const resolvedFields: Record<string, FieldConfig> = JSON.parse(JSON.stringify(resource.fields));
	for (const [fieldName, fieldConfig] of Object.entries(resource.fields)) {
		if (fieldConfig.referencesResource) {
			const targetResource = registry.getResource(fieldConfig.referencesResource);
			if (targetResource) {
				const targetData = await fetchResourceList(targetResource, { perPage: 100 });
				const labelKey = fieldConfig.referenceLabelField || 'name';
				const options = targetData.items.map((it: any) => ({
					label: String(it[labelKey] || it.title || it.name || it[targetResource.primaryKey]),
					value: it[targetResource.primaryKey]
				}));
				resolvedFields[fieldName] = {
					...fieldConfig,
					widget: 'select',
					options
				};
			}
		}
	}

	return {
		isNew,
		resource: {
			name: resource.name,
			label: resource.label,
			singularLabel: resource.singularLabel,
			icon: resource.icon,
			primaryKey: resource.primaryKey,
			fields: resolvedFields
		},
		item: item || {}
	};
};

export const actions: Actions = {
	save: async ({ params, request, locals }) => {
		const resource = registry.getResource(params.resource);
		if (!resource) return fail(404, { error: 'Resource not found' });

		const isNew = params.id === 'new';
		if (isNew && resource.permissions.create && !resource.permissions.create(locals.user)) {
			return fail(403, { error: 'Permission denied' });
		}
		if (!isNew && resource.permissions.edit && !resource.permissions.edit(locals.user)) {
			return fail(403, { error: 'Permission denied' });
		}

		const formData = await request.formData();
		const dataToSave: Record<string, unknown> = {};

		for (const [fieldName, fieldConfig] of Object.entries(resource.fields)) {
			if (fieldConfig.primaryKey && isNew) continue;
			if (fieldConfig.readonly && !isNew) continue;

			const rawValue = formData.get(fieldName);

			if (fieldConfig.widget === 'switch' || fieldConfig.dataType === 'boolean') {
				dataToSave[fieldName] =
					formData.get(fieldName) === 'on' || formData.get(fieldName) === 'true';
			} else if (fieldConfig.dataType === 'number') {
				if (rawValue !== null && rawValue !== '') {
					dataToSave[fieldName] = Number(rawValue);
				}
			} else if (fieldConfig.dataType === 'date') {
				if (rawValue) {
					dataToSave[fieldName] = new Date(String(rawValue));
				}
			} else if (rawValue !== null && rawValue !== '') {
				dataToSave[fieldName] = rawValue;
			}
		}

		// If resource has a string primary key (e.g. user) and isNew, generate UUID
		if (
			isNew &&
			!dataToSave[resource.primaryKey] &&
			resource.fields[resource.primaryKey]?.dataType === 'string'
		) {
			dataToSave[resource.primaryKey] = crypto.randomUUID();
		}

		try {
			if (isNew) {
				await createResourceItem(resource, dataToSave);
			} else {
				await updateResourceItem(resource, params.id, dataToSave);
			}
		} catch (err: any) {
			return fail(500, { error: err?.message || 'Failed to save record' });
		}

		throw redirect(302, `/admin/${resource.name}`);
	},
	delete: async ({ params, locals }) => {
		const resource = registry.getResource(params.resource);
		if (!resource) return fail(404, { error: 'Resource not found' });

		if (resource.permissions.delete && !resource.permissions.delete(locals.user)) {
			return fail(403, { error: 'Permission denied' });
		}

		try {
			await deleteResourceItem(resource, params.id);
		} catch (err: any) {
			return fail(500, { error: err?.message || 'Failed to delete record' });
		}

		throw redirect(302, `/admin/${resource.name}`);
	}
};
