# 🍷 Sangria

> **The Batteries-Included SvelteKit Framework for Solo Web Developers**  
> Bringing the out-of-the-box productivity of **Django** and the modular DX of **Nuxt Modules** to **SvelteKit 2 + Svelte 5 Runes**.

---

## ✨ Features & Batteries

- 🚀 **Auto-Introspecting `/admin`**: Instant CRUD dashboard with search, Funnels, sorting, pagination, and forms generated from Drizzle schemas.
- 🛡️ **Authentication & RBAC**: Better-Auth with session cookies, social OAuth, role guards, and a 1-command `createsuperuser` CLI.
- 🐘 **PostgreSQL 18 + Drizzle ORM**: Type-safe relational models, automated migrations, and Zod validation.
- ⚡ **Background Jobs**: PostgreSQL-backed task queue with `pg-boss` and admin queue monitoring.
- ✉️ **Transactional Email**: Nodemailer transport with Svelte email templates and local **Mailpit** inbox on port `8025`.
- 🗄️ **Object Storage**: S3 & MinIO client with direct presigned uploads on port `9000` (API) and `9001` (Console).
- 🧩 **Modular Architecture**: Nuxt-style module plugin system (`defineSangriaModule`).
- 🦭 **Podman & Docker Ready**: Rootless container setup via `compose.yaml` and multi-stage `Containerfile`.

---

## 🚀 Quick Start

### 1. Start Infrastructure with Podman (or Docker)

```bash
# Start PostgreSQL 18, Mailpit (email), and MinIO (S3 storage)
podman compose up -d
# or: docker compose up -d
```

### 2. Push Database Schema

```bash
pnpm db:push
```

### 3. Create a Superadministrator

```bash
pnpm sangria createsuperuser
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit:

- **Public Site**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Mailpit Dev Inbox**: [http://localhost:8025](http://localhost:8025)
- **MinIO S3 Console**: [http://localhost:9001](http://localhost:9001)

---

## 🛠️ CLI Commands

```bash
# Create an admin account interactively
pnpm sangria createsuperuser

# Scaffold a new Drizzle model + Admin resource
pnpm sangria make:resource <name>

# Generate a new modular package
pnpm sangria make:module <name>

# Start the background task queue worker
pnpm sangria queue:work
```

---

## 📐 Defining Admin Resources

```typescript
// src/lib/server/admin/resources.ts
import { defineResource } from '$lib/sangria';
import { task } from '$lib/server/db/schema';

export const taskResource = defineResource(task, {
	name: 'task',
	label: 'Tasks',
	singularLabel: 'Task',
	icon: 'SquareCheckBig',
	group: 'Core',
	list: {
		columns: ['id', 'title', 'status', 'priority', 'dueDate', 'createdAt'],
		searchable: ['title', 'description'],
		Funnelable: ['status', 'priority'],
		sortable: ['id', 'title', 'priority', 'dueDate', 'createdAt']
	},
	fields: {
		id: { readonly: true },
		description: { widget: 'textarea' },
		status: {
			widget: 'select',
			options: [
				{ label: 'To Do', value: 'todo' },
				{ label: 'In Progress', value: 'in_progress' },
				{ label: 'Done', value: 'done' }
			]
		}
	},
	permissions: {
		view: (user) => true,
		create: (user) => user?.role === 'admin' || user?.role === 'superadmin',
		edit: (user) => user?.role === 'admin' || user?.role === 'superadmin',
		delete: (user) => user?.role === 'superadmin'
	}
});
```

---

## 🏗️ Production Build & Container

```bash
# Build the application
pnpm build

# Build production container image with Podman
podman build -t sangria-app -f Containerfile .
```
