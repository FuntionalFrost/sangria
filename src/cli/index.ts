#!/usr/bin/env node
import { defineCommand, runMain } from 'citty';
import { createSuperuserCommand } from './commands/createsuperuser';
import { makeResourceCommand } from './commands/make-resource';
import { makeModuleCommand } from './commands/make-module';
import { queueWorkCommand } from './commands/queue-work';

const main = defineCommand({
	meta: {
		name: 'sangria',
		version: '1.0.0',
		description: 'The batteries-included SvelteKit framework CLI'
	},
	subCommands: {
		createsuperuser: createSuperuserCommand,
		'make:resource': makeResourceCommand,
		'make:module': makeModuleCommand,
		'queue:work': queueWorkCommand
	}
});

runMain(main);
