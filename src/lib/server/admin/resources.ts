import { defineResource, registry } from '$lib/sangria';
import { user, task, post, category } from '$lib/server/db/schema';

export const userResource = defineResource(user, {
	name: 'user',
	label: 'Users',
	singularLabel: 'User',
	icon: 'Users',
	group: 'Authentication',
	list: {
		columns: ['id', 'name', 'email', 'role', 'emailVerified', 'createdAt'],
		searchable: ['name', 'email'],
		filterable: ['role', 'emailVerified'],
		sortable: ['name', 'email', 'createdAt', 'role'],
		perPage: 20
	},
	fields: {
		id: { readonly: true },
		role: {
			widget: 'select',
			options: [
				{ label: 'User', value: 'user' },
				{ label: 'Admin', value: 'admin' },
				{ label: 'Superadmin', value: 'superadmin' }
			]
		},
		banned: { widget: 'switch' },
		emailVerified: { widget: 'switch' }
	}
});

export const taskResource = defineResource(task, {
	name: 'task',
	label: 'Tasks',
	singularLabel: 'Task',
	icon: 'SquareCheckBig',
	group: 'Core',
	list: {
		columns: ['id', 'title', 'status', 'priority', 'dueDate', 'createdAt'],
		searchable: ['title', 'description'],
		filterable: ['status', 'priority'],
		sortable: ['id', 'title', 'priority', 'dueDate', 'createdAt'],
		perPage: 20
	},
	fields: {
		id: { readonly: true },
		status: {
			widget: 'select',
			options: [
				{ label: 'To Do', value: 'todo' },
				{ label: 'In Progress', value: 'in_progress' },
				{ label: 'Done', value: 'done' }
			]
		},
		priority: {
			widget: 'select',
			options: [
				{ label: 'Low (1)', value: 1 },
				{ label: 'Medium (2)', value: 2 },
				{ label: 'High (3)', value: 3 },
				{ label: 'Urgent (4)', value: 4 },
				{ label: 'Critical (5)', value: 5 }
			]
		},
		description: { widget: 'textarea' }
	}
});

export const postResource = defineResource(post, {
	name: 'post',
	label: 'Posts',
	singularLabel: 'Post',
	icon: 'FileText',
	group: 'CMS',
	list: {
		columns: ['id', 'title', 'slug', 'published', 'createdAt'],
		searchable: ['title', 'slug', 'content'],
		filterable: ['published'],
		sortable: ['id', 'title', 'createdAt', 'published'],
		perPage: 20
	},
	fields: {
		id: { readonly: true },
		authorId: {
			label: 'Author',
			referencesResource: 'user',
			referenceLabelField: 'name'
		},
		content: { widget: 'textarea' },
		published: { widget: 'switch' }
	}
});

export const categoryResource = defineResource(category, {
	name: 'category',
	label: 'Categories',
	singularLabel: 'Category',
	icon: 'Folder',
	group: 'CMS',
	list: {
		columns: ['id', 'name', 'slug', 'createdAt'],
		searchable: ['name', 'slug', 'description'],
		sortable: ['id', 'name', 'createdAt'],
		perPage: 20
	},
	fields: {
		id: { readonly: true },
		description: { widget: 'textarea' }
	}
});

export function registerDefaultResources(): void {
	registry.registerResource(userResource);
	registry.registerResource(taskResource);
	registry.registerResource(postResource);
	registry.registerResource(categoryResource);
}

// Auto-register upon import
registerDefaultResources();
