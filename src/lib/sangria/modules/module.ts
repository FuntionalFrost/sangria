import type { SangriaModule, SangriaModuleContext } from '../core/types';

export function defineSangriaModule(moduleDef: {
	name: string;
	version?: string;
	description?: string;
	setup: (ctx: SangriaModuleContext) => void | Promise<void>;
}): SangriaModule {
	return {
		name: moduleDef.name,
		version: moduleDef.version || '1.0.0',
		description: moduleDef.description,
		setup: moduleDef.setup
	};
}
