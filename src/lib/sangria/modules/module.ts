import type { SangriaModule, SangriaModuleContext } from '../core/types';
import { registry } from '../core/registry';

const registeredModules = new Map<string, SangriaModule>();

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

export async function registerModule(module: SangriaModule): Promise<void> {
	if (registeredModules.has(module.name)) return;
	registeredModules.set(module.name, module);

	const context: SangriaModuleContext = {
		addResource: (res) => registry.registerResource(res),
		addHook: (_event, _handler) => {
			// Hook registry dispatcher
		}
	};

	await module.setup(context);
}

export function getRegisteredModules(): SangriaModule[] {
	return Array.from(registeredModules.values());
}
