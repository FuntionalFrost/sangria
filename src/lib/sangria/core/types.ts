import type { PgTable } from 'drizzle-orm/pg-core';
import type { SangriaUser } from '../../../app';

export type WidgetType =
	| 'text'
	| 'textarea'
	| 'number'
	| 'switch'
	| 'date'
	| 'datetime'
	| 'select'
	| 'json'
	| 'file'
	| 'badge';

export interface FieldOption {
	label: string;
	value: string | number | boolean;
}

export interface FieldConfig {
	name: string;
	label: string;
	dataType: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'unknown';
	widget: WidgetType;
	required?: boolean;
	nullable?: boolean;
	primaryKey?: boolean;
	defaultValue?: unknown;
	placeholder?: string;
	options?: FieldOption[] | Array<string | number>;
	helpText?: string;
	readonly?: boolean;
	hidden?: boolean;
	referencesResource?: string;
	referenceLabelField?: string;
}

export interface ResourceListConfig {
	columns?: string[];
	searchable?: string[];
	filterable?: string[];
	sortable?: string[];
	defaultSort?: { column: string; direction: 'asc' | 'desc' };
	perPage?: number;
	actions?: Array<'delete' | 'export' | { name: string; label: string; action: string }>;
}

export interface ResourceFormConfig {
	fields?: Record<string, Partial<FieldConfig>>;
}

export interface ResourcePermissions {
	view?: (user?: SangriaUser | null) => boolean;
	create?: (user?: SangriaUser | null) => boolean;
	edit?: (user?: SangriaUser | null) => boolean;
	delete?: (user?: SangriaUser | null) => boolean;
}

export interface ResourceDefinition<TTable extends PgTable = PgTable> {
	name: string;
	label: string;
	singularLabel: string;
	icon: string;
	group: string;
	table: TTable;
	primaryKey: string;
	fields: Record<string, FieldConfig>;
	list: ResourceListConfig;
	form: ResourceFormConfig;
	permissions: ResourcePermissions;
}

export interface SangriaModuleContext {
	addResource: (resource: ResourceDefinition) => void;
	addHook: (event: string, handler: (...args: unknown[]) => unknown) => void;
}

export interface SangriaModule {
	name: string;
	version: string;
	description?: string;
	setup: (ctx: SangriaModuleContext) => void | Promise<void>;
}

export interface QueryParams {
	page?: number;
	perPage?: number;
	search?: string;
	sort?: string;
	order?: 'asc' | 'desc';
	filters?: Record<string, string | number | boolean>;
}

export interface PaginatedResult<T = Record<string, unknown>> {
	items: T[];
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
}
