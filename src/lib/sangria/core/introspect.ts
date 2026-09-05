import { getTableColumns } from 'drizzle-orm';
import { getTableConfig, type PgTable, type PgColumn } from 'drizzle-orm/pg-core';
import type { FieldConfig, WidgetType } from './types';

function toTitleCase(str: string): string {
	return str
		.replace(/([A-Z])/g, ' $1')
		.replace(/[_-]/g, ' ')
		.replace(/^\w/, (c) => c.toUpperCase())
		.trim();
}

function inferWidget(dataType: string, columnName: string): WidgetType {
	const name = columnName.toLowerCase();
	if (name.includes('password')) return 'text';
	if (name.includes('email')) return 'text';
	if (name.includes('content') || name.includes('description') || name.includes('body'))
		return 'textarea';
	if (name.includes('image') || name.includes('avatar') || name.includes('file')) return 'file';
	if (name.startsWith('is') || name.startsWith('has') || dataType === 'boolean') return 'switch';
	if (
		dataType === 'number' ||
		dataType === 'integer' ||
		dataType === 'bigint' ||
		dataType === 'serial'
	)
		return 'number';
	if (dataType === 'date' || dataType === 'timestamp') return 'datetime';
	if (dataType === 'json' || dataType === 'jsonb') return 'json';
	return 'text';
}

function mapDataType(
	dataType: string | undefined,
	columnType: string | undefined
): FieldConfig['dataType'] {
	if (
		dataType === 'number' ||
		dataType === 'boolean' ||
		dataType === 'date' ||
		dataType === 'json'
	) {
		return dataType;
	}
	const t = (columnType || '').toLowerCase();
	if (
		t.includes('int') ||
		t.includes('serial') ||
		t.includes('numeric') ||
		t.includes('real') ||
		t.includes('double')
	) {
		return 'number';
	}
	if (t.includes('bool')) {
		return 'boolean';
	}
	if (t.includes('timestamp') || t.includes('date') || t.includes('time')) {
		return 'date';
	}
	if (t.includes('json')) {
		return 'json';
	}
	return 'string';
}

function sanitizeDefaultValue(val: unknown): unknown {
	if (val === null || val === undefined) return undefined;
	if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
		return val;
	}
	if (val instanceof Date) {
		return val.toISOString();
	}
	if (typeof val === 'object') {
		try {
			if (Object.getPrototypeOf(val) === Object.prototype || Array.isArray(val)) {
				return JSON.parse(JSON.stringify(val));
			}
		} catch {
			return undefined;
		}
	}
	return undefined;
}

export function introspectTable(table: PgTable): {
	tableName: string;
	primaryKey: string;
	fields: Record<string, FieldConfig>;
} {
	const config = getTableConfig(table);
	const tableName = config.name;
	const columns = getTableColumns(table);
	const fields: Record<string, FieldConfig> = {};
	let primaryKey = 'id';

	for (const [propName, column] of Object.entries(columns) as [string, PgColumn][]) {
		const dataType = mapDataType((column as any).dataType, column.columnType);
		const isPrimary = column.primary;
		if (isPrimary) {
			primaryKey = propName;
		}

		fields[propName] = {
			name: propName,
			label: toTitleCase(propName),
			dataType,
			widget: inferWidget(dataType, propName),
			required: column.notNull && !column.hasDefault && !isPrimary,
			nullable: !column.notNull,
			primaryKey: isPrimary,
			defaultValue: sanitizeDefaultValue(column.default),
			readonly: isPrimary,
			hidden: propName === 'password'
		};
	}

	return {
		tableName,
		primaryKey,
		fields
	};
}
