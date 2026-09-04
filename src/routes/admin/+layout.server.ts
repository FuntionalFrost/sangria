import type { LayoutServerLoad } from './$types';
import { registry } from '$lib/sangria';
import '$lib/server/admin/resources';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const allResources = registry.getAllResources().map((r) => ({
		name: r.name,
		label: r.label,
		singularLabel: r.singularLabel,
		icon: r.icon,
		group: r.group
	}));

	// Group resources
	const groups: Record<string, typeof allResources> = {};
	for (const res of allResources) {
		if (!groups[res.group]) groups[res.group] = [];
		groups[res.group].push(res);
	}

	return {
		user: locals.user,
		groups,
		allResources,
		pathname: url.pathname
	};
};
