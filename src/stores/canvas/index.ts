import type { ImageInfo } from '$types/canvas';
import { writable } from 'svelte/store';
import {
	createElements,
	createScale,
	createSelectedClass,
	createSelectedElement,
	createSelectedTool,
	createViewPos
} from './create';

export const canvasStore = {
	imageInfo: writable<ImageInfo | null>(null),
	scale: createScale(),
	viewPos: createViewPos(),
	selectedElement: createSelectedElement(),
	selectedClass: createSelectedClass(),
	selectedTool: createSelectedTool(),
	elements: createElements()
};
