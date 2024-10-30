import type { ImageInfo, Shape, Size } from '$types/Canvas';
import { writable } from 'svelte/store';
import {
	createCanvasBrightness,
	createCanvasContrast,
	createElementsStore,
	createHistoryStore,
	createScaleStore,
	createSelectedClassStore,
	createSelectedElementStore,
	createSelectedToolStore,
	createViewPosStore
} from './create';
import { INITIAL_SIZE } from '$lib/constants/canvas';

export const canvasStore = {
	canvasSize: writable<Size>(INITIAL_SIZE),
	imageInfo: writable<ImageInfo | null>(null),
	scale: createScaleStore(),
	viewPos: createViewPosStore(),
	selectedElement: createSelectedElementStore(),
	selectedClass: createSelectedClassStore(),
	selectedTool: createSelectedToolStore(),
	elements: createElementsStore(),
	history: createHistoryStore<Shape>(),
	brightness: createCanvasBrightness(),
	contrast: createCanvasContrast()
};
