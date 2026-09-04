import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user, task, post, category } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	let userCount = 0;
	let taskCount = 0;
	let postCount = 0;
	let categoryCount = 0;
	let recentTasks: any[] = [];
	let recentPosts: any[] = [];

	try {
		const [u, t, p, c] = await Promise.all([
			db.select({ count: count() }).from(user),
			db.select({ count: count() }).from(task),
			db.select({ count: count() }).from(post),
			db.select({ count: count() }).from(category)
		]);

		userCount = Number(u[0]?.count || 0);
		taskCount = Number(t[0]?.count || 0);
		postCount = Number(p[0]?.count || 0);
		categoryCount = Number(c[0]?.count || 0);

		// Get recent tasks
		recentTasks = await db.select().from(task).limit(5);
		recentPosts = await db.select().from(post).limit(5);
	} catch (err) {
		console.warn('[Admin Dashboard] DB query error (tables may need push):', err);
	}

	return {
		stats: {
			users: userCount,
			tasks: taskCount,
			posts: postCount,
			categories: categoryCount
		},
		recentTasks,
		recentPosts,
		user: locals.user
	};
};
