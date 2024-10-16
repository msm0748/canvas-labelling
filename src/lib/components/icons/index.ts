import type { ComponentType } from 'svelte';

// Define the type for the import function
type ImportFunction = () => Promise<{ default: ComponentType }>;

// Define the type for the iconModules
const iconModules: Record<string, ImportFunction> = import.meta.glob<{ default: ComponentType }>(
	'./!(index).svelte'
);

// Define the type for the icons array
interface IconEntry {
	name: string | undefined;
	component: () => Promise<ComponentType>;
}

export const icons: IconEntry[] = Object.entries(iconModules).map(([path, importFn]) => {
	const name = path.split('/').pop()?.replace('.svelte', '');
	return {
		name,
		component: async () => {
			const module = await importFn();
			return module.default;
		}
	};
});
