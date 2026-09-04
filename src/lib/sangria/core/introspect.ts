import { getTableConfig, type PgTable, type PgColumn } from 'drizzle-orm/pg-core';
import type { FieldConfig, WidgetType } from './types';

function toTitleCase(str: string): string {
	return str
		.replace(/([A-Z])/g, ' ')
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

function mapDataType(columnType: string): FieldConfig['dataType'] {
	const t = columnType.toLowerCase();
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

export function introspectTable(table: PgTable): {
	tableName: string;
	primaryKey: string;
	fields: Record<string, FieldConfig>;
} {
	const config = getTableConfig(table);
	const tableName = config.name;
	const fields: Record<string, FieldConfig> = {};
	let primaryKey = 'id';

	for (const column of config.columns as PgColumn[]) {
		const colName = column.name;
		const colType = column.columnType;
		const dataType = mapDataType(colType);
		const isPrimary = column.primary;
		if (isPrimary) {
			primaryKey = colName;
		}

		fields[colName] = {
			name: colName,
			label: toTitleCase(colName),
			dataType,
			widget: inferWidget(dataType, colName),
			required: column.notNull && !column.hasDefault && !isPrimary,
			nullable: !column.notNull,
			primaryKey: isPrimary,
			defaultValue: column.default,
			readonly: isPrimary,
			hidden: colName === 'password'
		};
	}

	return {
		tableName,
		primaryKey,
		fields
	};
}
