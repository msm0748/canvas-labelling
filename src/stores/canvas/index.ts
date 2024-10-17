import { INITIAL_POSITION, INITIAL_SCALE } from '$lib/constants/canvas';
import type { ImageInfo } from '$types/canvas';
import { writable } from 'svelte/store';

export const canvasStore = {
	imageInfo: writable<ImageInfo | null>(null),
	scale: writable<number>(INITIAL_SCALE),
	viewPos: writable(INITIAL_POSITION)
};
