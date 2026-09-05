import { sql, and, or, ilike, eq, asc, desc, count, getTableColumns, inArray } from 'drizzle-orm';
import type { PgTable, PgColumn } from 'drizzle-orm/pg-core';
import type { ResourceDefinition, QueryParams, PaginatedResult } from '../core/types';
import { db } from '$lib/server/db';

function buildColumnsMap(table: PgTable): Map<string, PgColumn> {
	const columnsMap = new Map<string, PgColumn>();
	const cols = getTableColumns(table);
	for (const [propName, col] of Object.entries(cols) as [string, PgColumn][]) {
		columnsMap.set(propName, col);
		if (col.name) {
			columnsMap.set(col.name, col);
		}
	}
	return columnsMap;
}

export async function fetchResourceList(
	resource: ResourceDefinition,
	params: QueryParams = {}
): Promise<PaginatedResult> {
	const table = resource.table as PgTable;
	const columnsMap = buildColumnsMap(table);

	const page = Math.max(1, Number(params.page) || 1);
	const perPage = Math.min(100, Math.max(1, Number(params.perPage) || resource.list.perPage || 20));
	const offset = (page - 1) * perPage;

	const conditions = [];

	// Search logic
	if (params.search && params.search.trim()) {
		const searchTerms = params.search.trim();
		const searchableCols = resource.list.searchable || [];
		const searchConditions = [];

		for (const colName of searchableCols) {
			const col = columnsMap.get(colName);
			if (col) {
				// Use sql to cast to text for safe ilike matching
				searchConditions.push(ilike(sql`CAST(${col} AS TEXT)`, `%${searchTerms}%`));
			}
		}

		if (searchConditions.length > 0) {
			conditions.push(or(...searchConditions));
		}
	}

	// Filter logic
	if (params.filters) {
		for (const [colName, val] of Object.entries(params.filters)) {
			if (val !== undefined && val !== null && val !== '') {
				const col = columnsMap.get(colName);
				if (col) {
					if (typeof val === 'boolean' || val === 'true' || val === 'false') {
						conditions.push(eq(col, val === true || val === 'true'));
					} else {
						conditions.push(eq(col, val));
					}
				}
			}
		}
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	// Sort logic
	const sortColName = params.sort || resource.list.defaultSort?.column || resource.primaryKey;
	const sortOrder = (params.order || resource.list.defaultSort?.direction || 'desc').toLowerCase();
	const sortCol = columnsMap.get(sortColName) || columnsMap.get(resource.primaryKey);

	const orderByClause = sortCol ? (sortOrder === 'asc' ? asc(sortCol) : desc(sortCol)) : undefined;

	// Query data and total count concurrently
	const dbClient = db as any;

	let countQuery = dbClient.select({ value: count() }).from(table);
	if (whereClause) {
		countQuery = countQuery.where(whereClause);
	}

	let dataQuery = dbClient.select().from(table);
	if (whereClause) {
		dataQuery = dataQuery.where(whereClause);
	}
	if (orderByClause) {
		dataQuery = dataQuery.orderBy(orderByClause);
	}
	dataQuery = dataQuery.limit(perPage).offset(offset);

	const [totalResult, items] = await Promise.all([countQuery, dataQuery]);
	const total = Number(totalResult[0]?.value || 0);

	return {
		items,
		total,
		page,
		perPage,
		totalPages: Math.ceil(total / perPage) || 1
	};
}

export async function fetchResourceItem(
	resource: ResourceDefinition,
	id: string | number
): Promise<Record<string, unknown> | null> {
	const table = resource.table as PgTable;
	const columnsMap = buildColumnsMap(table);
	const pkCol = columnsMap.get(resource.primaryKey);

	if (!pkCol) throw new Error(`Primary key not found for resource ${resource.name}`);

	const isNum =
		(pkCol as any).dataType === 'number' ||
		(pkCol as any).columnType?.includes('Int') ||
		(pkCol as any).columnType?.includes('Serial');
	const parsedId = isNum && !isNaN(Number(id)) ? Number(id) : id;

	const dbClient = db as any;
	const items = await dbClient.select().from(table).where(eq(pkCol, parsedId)).limit(1);

	return items[0] || null;
}

export async function createResourceItem(
	resource: ResourceDefinition,
	data: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const table = resource.table as PgTable;
	const dbClient = db as any;
	const result = await dbClient.insert(table).values(data).returning();
	return result[0];
}

export async function updateResourceItem(
	resource: ResourceDefinition,
	id: string | number,
	data: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const table = resource.table as PgTable;
	const columnsMap = buildColumnsMap(table);
	const pkCol = columnsMap.get(resource.primaryKey);

	if (!pkCol) throw new Error(`Primary key not found for resource ${resource.name}`);

	const isNum =
		(pkCol as any).dataType === 'number' ||
		(pkCol as any).columnType?.includes('Int') ||
		(pkCol as any).columnType?.includes('Serial');
	const parsedId = isNum && !isNaN(Number(id)) ? Number(id) : id;

	const dbClient = db as any;
	const result = await dbClient.update(table).set(data).where(eq(pkCol, parsedId)).returning();
	return result[0];
}

export async function deleteResourceItem(
	resource: ResourceDefinition,
	id: string | number
): Promise<boolean> {
	const table = resource.table as PgTable;
	const columnsMap = buildColumnsMap(table);
	const pkCol = columnsMap.get(resource.primaryKey);

	if (!pkCol) throw new Error(`Primary key not found for resource ${resource.name}`);

	const isNum =
		(pkCol as any).dataType === 'number' ||
		(pkCol as any).columnType?.includes('Int') ||
		(pkCol as any).columnType?.includes('Serial');
	const parsedId = isNum && !isNaN(Number(id)) ? Number(id) : id;

	const dbClient = db as any;
	await dbClient.delete(table).where(eq(pkCol, parsedId));
	return true;
}

export async function bulkDeleteResourceItems(
	resource: ResourceDefinition,
	ids: Array<string | number>
): Promise<number> {
	if (!ids || ids.length === 0) return 0;

	const table = resource.table as PgTable;
	const columnsMap = buildColumnsMap(table);
	const pkCol = columnsMap.get(resource.primaryKey);

	if (!pkCol) throw new Error(`Primary key not found for resource ${resource.name}`);

	const isNum =
		(pkCol as any).dataType === 'number' ||
		(pkCol as any).columnType?.includes('Int') ||
		(pkCol as any).columnType?.includes('Serial');

	const parsedIds = ids.map((id) => (isNum && !isNaN(Number(id)) ? Number(id) : id));

	const dbClient = db as any;
	await dbClient.delete(table).where(inArray(pkCol, parsedIds));
	return parsedIds.length;
}
