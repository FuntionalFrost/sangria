import * as p from '@clack/prompts';
import { defineCommand } from 'citty';
import fs from 'node:fs';
import path from 'node:path';

export const makeModuleCommand = defineCommand({
	meta: {
		name: 'make:module',
		description: 'Create a new modular package for Sangria'
	},
	args: {
		name: {
			type: 'positional',
			description: 'Module name (e.g. analytics, billing, blog)',
			required: false
		}
	},
	async run({ args }) {
		p.intro('Sangria - Create Module');

		let moduleName = args.name;
		if (!moduleName) {
			const inputName = await p.text({
				message: 'Enter module name (e.g. analytics, billing):',
				placeholder: 'analytics',
				validate: (val) => (!val ? 'Name is required' : undefined)
			});
			if (p.isCancel(inputName)) return;
			moduleName = inputName as string;
		}

		moduleName = moduleName.toLowerCase().trim();
		const targetDir = path.resolve(process.cwd(), `src/lib/modules/${moduleName}`);

		if (fs.existsSync(targetDir)) {
			p.log.error(`Module directory already exists at: ${targetDir}`);
			return;
		}

		fs.mkdirSync(targetDir, { recursive: true });

		// 1. Create index.ts
		const indexContent = `import { defineSangriaModule } from '$lib/sangria';

export default defineSangriaModule({
	name: 'sangria-${moduleName}',
	version: '1.0.0',
	description: '${moduleName} module for Sangria',
	setup(ctx) {
		console.log('[Sangria Module] Initialized ${moduleName}');
		// Register module resources or hooks here
	}
});
`;
		fs.writeFileSync(path.join(targetDir, 'index.ts'), indexContent, 'utf8');

		p.note(`Created module files in: src/lib/modules/${moduleName}/`, 'Module Scaffolding');
		p.outro('Sangria module created successfully.');
	}
});
