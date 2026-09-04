import type { PgTable } from 'drizzle-orm/pg-core';
import { introspectTable } from '../core/introspect';
import type {
	ResourceDefinition,
	ResourceListConfig,
	ResourceFormConfig,
	ResourcePermissions,
	FieldConfig
} from '../core/types';

export interface DefineResourceOptions {
	name?: string;
	label?: string;
	singularLabel?: string;
	icon?: string;
	group?: string;
	list?: ResourceListConfig;
	form?: ResourceFormConfig;
	permissions?: ResourcePermissions;
	fields?: Record<string, Partial<FieldConfig>>;
}

export function defineResource<TTable extends PgTable>(
	table: TTable,
	options: DefineResourceOptions = {}
): ResourceDefinition<TTable> {
	const introspection = introspectTable(table);
	const name = options.name || introspection.tableName;
	const label =
		options.label || name.charAt(0).toUpperCase() + name.slice(1) + (name.endsWith('s') ? '' : 's');
	const singularLabel = options.singularLabel || name.charAt(0).toUpperCase() + name.slice(1);

	const mergedFields: Record<string, FieldConfig> = { ...introspection.fields };
	if (options.fields) {
		for (const [key, fieldOverride] of Object.entries(options.fields)) {
			if (mergedFields[key]) {
				mergedFields[key] = { ...mergedFields[key], ...fieldOverride };
			} else {
				mergedFields[key] = {
					name: key,
					label: key.charAt(0).toUpperCase() + key.slice(1),
					dataType: 'string',
					widget: 'text',
					...fieldOverride
				} as FieldConfig;
			}
		}
	}

	const allColumns = Object.keys(mergedFields);
	const defaultColumns = allColumns.filter((col) => col !== 'password').slice(0, 6);

	const listConfig: ResourceListConfig = {
		columns: options.list?.columns || defaultColumns,
		searchable:
			options.list?.searchable || allColumns.filter((c) => mergedFields[c].dataType === 'string'),
		filterable:
			options.list?.filterable ||
			allColumns.filter(
				(c) => mergedFields[c].dataType === 'boolean' || mergedFields[c].widget === 'select'
			),
		sortable: options.list?.sortable || allColumns,
		defaultSort: options.list?.defaultSort || {
			column: introspection.primaryKey,
			direction: 'desc'
		},
		perPage: options.list?.perPage || 20,
		actions: options.list?.actions || ['delete', 'export']
	};

	return {
		name,
		label,
		singularLabel,
		icon: options.icon || 'Database',
		group: options.group || 'Resources',
		table,
		primaryKey: introspection.primaryKey,
		fields: mergedFields,
		list: listConfig,
		form: options.form || {},
		permissions: options.permissions || {
			view: () => true,
			create: () => true,
			edit: () => true,
			delete: () => true
		}
	};
}
