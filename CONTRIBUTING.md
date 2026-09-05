# Contributing to Sangria 🍷

Thank you for considering contributing to **Sangria**! We welcome contributions from developers of all skill levels.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v20 or higher
- **pnpm**: v9 or higher
- **Podman** or **Docker**: for running PostgreSQL 18, Mailpit, and MinIO S3 containers

### 2. Quickstart Environment

```bash
# 1. Clone the repository
git clone https://github.com/FuntionalFrost/sangria.git
cd sangria

# 2. Install dependencies
pnpm install

# 3. Start PostgreSQL, Mailpit, and MinIO infrastructure
pnpm db:start

# 4. Push database schema
pnpm db:push

# 5. Create a superadministrator account
pnpm sangria createsuperuser

# 6. Start the development server
pnpm dev
```

---

## 🧪 Code Quality & Verification

Before submitting a Pull Request, please make sure type checks and builds pass cleanly:

```bash
# Type check Svelte & TypeScript
pnpm check

# Verify production build
pnpm build
```

---

## 📄 License
By contributing to Sangria, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
