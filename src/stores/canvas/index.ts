import type { ImageInfo } from '$types/canvas';
import { writable } from 'svelte/store';
import { createScale, createViewPos } from './create';

export const canvasStore = {
	imageInfo: writable<ImageInfo | null>(null),
	scale: createScale(),
	viewPos: createViewPos()
};
