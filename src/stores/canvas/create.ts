import {
	INITIAL_POSITION,
	INITIAL_SCALE,
	INITIAL_SELECTED_TOOL,
	MAX_SCALE,
	MIN_SCALE,
	ZOOM_SENSITIVITY
} from '$lib/constants/canvas';
import type { Position, SelectedClass, Shape, Tool } from '$types/Canvas';
import { writable } from 'svelte/store';

export const createSelectedElement = () => {
	const { subscribe, update, set } = writable<Shape | null>(null);

	const select = (element: Shape) => set(element);

	const reset = () => set(null);

	return {
		subscribe,
		select,
		reset,
		update
	};
};

export const createElements = () => {
	const { subscribe, set, update } = writable<Shape[]>([]);

	const reset = () => set([]);

	return {
		subscribe,
		set,
		reset,
		update
	};
};

export const createViewPos = () => {
	const { subscribe, set, update } = writable<Position>(INITIAL_POSITION);

	const move = (deltaX: number, deltaY: number) => {
		update((pos) => ({
			x: pos.x - deltaX,
			y: pos.y - deltaY
		}));
	};

	const zoom = (adjustedX: number, adjustedY: number) =>
		set({
			x: adjustedX,
			y: adjustedY
		});

	const reset = () => set(INITIAL_POSITION);
	return {
		subscribe,
		move,
		zoom,
		reset
	};
};

/** 클래스 선택하는 함수 */
export const createSelectedClass = () => {
	const { subscribe, set } = writable<SelectedClass>({ id: 0, label: '새', color: '#0094FF' });

	const select = (id: number, label: string, color: string) => {
		set({ id, label, color });
	};

	return {
		subscribe,
		select
	};
};

export const createSelectedTool = () => {
	const { subscribe, set } = writable<Tool>(INITIAL_SELECTED_TOOL);

	const select = (tool: Tool) => {
		set(tool);
	};

	const reset = () => set(INITIAL_SELECTED_TOOL);

	return {
		subscribe,
		select,
		reset
	};
};

export const createScale = () => {
	const { subscribe, set, update } = writable<number>(INITIAL_SCALE);

	const zoomIn = () => {
		update((scale) => {
			if (scale < MAX_SCALE - ZOOM_SENSITIVITY) {
				return scale + ZOOM_SENSITIVITY;
			}
			return scale;
		});
	};

	const zoomOut = () => {
		update((scale) => {
			if (scale > MIN_SCALE + ZOOM_SENSITIVITY) {
				return scale - ZOOM_SENSITIVITY;
			}
			return scale;
		});
	};

	const reset = () => set(INITIAL_SCALE);

	return {
		subscribe,
		zoomIn,
		zoomOut,
		reset
	};
};
