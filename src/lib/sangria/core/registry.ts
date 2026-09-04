import type { ResourceDefinition, SangriaModule } from './types';

class SangriaRegistry {
	private resources: Map<string, ResourceDefinition> = new Map();
	private modules: Map<string, SangriaModule> = new Map();
	private hooks: Map<string, Array<(...args: unknown[]) => unknown>> = new Map();

	registerResource(resource: ResourceDefinition): void {
		this.resources.set(resource.name, resource);
	}

	getResource(name: string): ResourceDefinition | undefined {
		return this.resources.get(name);
	}

	getAllResources(): ResourceDefinition[] {
		return Array.from(this.resources.values());
	}

	registerModule(mod: SangriaModule): void {
		this.modules.set(mod.name, mod);
		mod.setup({
			addResource: (res) => this.registerResource(res),
			addHook: (event, handler) => this.addHook(event, handler)
		});
	}

	getAllModules(): SangriaModule[] {
		return Array.from(this.modules.values());
	}

	addHook(event: string, handler: (...args: unknown[]) => unknown): void {
		const existing = this.hooks.get(event) || [];
		existing.push(handler);
		this.hooks.set(event, existing);
	}

	async triggerHook(event: string, ...args: unknown[]): Promise<void> {
		const handlers = this.hooks.get(event) || [];
		for (const handler of handlers) {
			await handler(...args);
		}
	}
}

export const registry = new SangriaRegistry();
