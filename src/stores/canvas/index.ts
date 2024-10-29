import type { ImageInfo, Shape } from '$types/Canvas';
import { writable } from 'svelte/store';
import {
	createElementsStore,
	createHistoryStore,
	createScaleStore,
	createSelectedClassStore,
	createSelectedElementStore,
	createSelectedToolStore,
	createViewPosStore
} from './create';

export const canvasStore = {
	imageInfo: writable<ImageInfo | null>(null),
	scale: createScaleStore(),
	viewPos: createViewPosStore(),
	selectedElement: createSelectedElementStore(),
	selectedClass: createSelectedClassStore(),
	selectedTool: createSelectedToolStore(),
	elements: createElementsStore(),
	history: createHistoryStore<Shape>()
};
