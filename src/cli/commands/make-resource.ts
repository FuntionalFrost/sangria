import * as p from '@clack/prompts';
import { defineCommand } from 'citty';
import fs from 'node:fs';
import path from 'node:path';

export const makeResourceCommand = defineCommand({
	meta: {
		name: 'make:resource',
		description: 'Scaffold a new Drizzle schema and Sangria admin resource'
	},
	args: {
		name: {
			type: 'positional',
			description: 'The name of the resource (e.g. product, article, order)',
			required: false
		}
	},
	async run({ args }) {
		p.intro('Sangria - Scaffold Resource');

		let resourceName = args.name;
		if (!resourceName) {
			const inputName = await p.text({
				message: 'Enter resource name (singular, e.g. product):',
				placeholder: 'product',
				validate: (val) => (!val ? 'Name is required' : undefined)
			});
			if (p.isCancel(inputName)) return;
			resourceName = inputName as string;
		}

		resourceName = resourceName.toLowerCase().trim();
		const pluralName = resourceName.endsWith('s') ? resourceName : `${resourceName}s`;
		const capitalized = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
		const pluralCapitalized = pluralName.charAt(0).toUpperCase() + pluralName.slice(1);

		const group = await p.select({
			message: 'Select admin group:',
			options: [
				{ label: 'Core', value: 'Core' },
				{ label: 'CMS', value: 'CMS' },
				{ label: 'E-Commerce', value: 'E-Commerce' },
				{ label: 'Custom', value: 'Custom' }
			]
		});
		if (p.isCancel(group)) return;

		const icon = await p.text({
			message: 'Enter Lucide icon name:',
			initialValue: 'Box'
		});
		if (p.isCancel(icon)) return;

		const s = p.spinner();
		s.start('Updating schema and admin resources...');

		// 1. Append table to schema.ts
		const schemaPath = path.resolve(process.cwd(), 'src/lib/server/db/schema.ts');
		const schemaContent = fs.readFileSync(schemaPath, 'utf8');

		const tableCode = `
export const ${resourceName} = pgTable('${resourceName}', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});
`;

		if (!schemaContent.includes(`export const ${resourceName} =`)) {
			const updatedSchema = schemaContent.replace(
				"export * from './auth.schema';",
				`${tableCode}\nexport * from './auth.schema';`
			);
			fs.writeFileSync(schemaPath, updatedSchema, 'utf8');
		}

		// 2. Append resource to resources.ts
		const resourcesPath = path.resolve(process.cwd(), 'src/lib/server/admin/resources.ts');
		const resourcesContent = fs.readFileSync(resourcesPath, 'utf8');

		const resourceCode = `
export const ${resourceName}Resource = defineResource(${resourceName}, {
	name: '${resourceName}',
	label: '${pluralCapitalized}',
	singularLabel: '${capitalized}',
	icon: '${icon}',
	group: '${group}',
	list: {
		columns: ['id', 'title', 'isActive', 'createdAt'],
		searchable: ['title', 'description'],
		filterable: ['isActive'],
		sortable: ['id', 'title', 'createdAt']
	},
	fields: {
		id: { readonly: true },
		description: { widget: 'textarea' },
		isActive: { widget: 'switch' }
	}
});
`;

		if (!resourcesContent.includes(`export const ${resourceName}Resource =`)) {
			let updatedResources = resourcesContent.replace(
				/import { (.*?) } from '\$lib\/server\/db\/schema';/,
				(match, imports) => `import { ${imports}, ${resourceName} } from '$lib/server/db/schema';`
			);

			updatedResources = updatedResources.replace(
				'export function registerDefaultResources(): void {',
				`${resourceCode}\nexport function registerDefaultResources(): void {\n\tregistry.registerResource(${resourceName}Resource);`
			);

			fs.writeFileSync(resourcesPath, updatedResources, 'utf8');
		}

		s.stop('Resource scaffolded successfully!');
		p.note(
			`1. Drizzle table added to: src/lib/server/db/schema.ts\n2. Admin view added to: src/lib/server/admin/resources.ts\n3. Run 'pnpm db:push' to sync database schema.`,
			'Next Steps'
		);
		p.outro('Sangria resource ready.');
	}
});
