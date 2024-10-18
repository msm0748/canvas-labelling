import {
	INITIAL_POSITION,
	INITIAL_SCALE,
	MAX_SCALE,
	MIN_SCALE,
	ZOOM_SENSITIVITY
} from '$lib/constants/canvas';
import type { Position, Shape } from '$types/canvas';
import { writable, get } from 'svelte/store';
import { canvasStore } from '.';

// export const createSelectedElement = () => {
// 	const { subscribe, update, set } = writable<Shape | null>(null);

// 	const select = (element: Shape) => {
// 		set(element);
// 	};

// 	const updatePoints = (newPoints: Point[]) => {
// 		update((selectedElement) => {
// 			if (selectedElement) {
// 				selectedElement.points = newPoints;
// 			}
// 			return selectedElement;
// 		});
// 	};

// 	const updateClass = (name: string, color: string) => {
// 		update((selectedElement) => {
// 			if (selectedElement) {
// 				selectedElement.label = name;
// 				selectedElement.color = color;
// 			}
// 			return selectedElement;
// 		});
// 	};

// 	const unselect = () => {
// 		set(null);
// 	};

// 	return {
// 		subscribe,
// 		select,
// 		updatePoints,
// 		updateClass,
// 		unselect
// 	};
// };

export const createViewPos = () => {
	const { subscribe, set, update } = writable<Position>(INITIAL_POSITION);

	const move = (deltaX: number, deltaY: number) => {
		update((pos) => ({
			x: pos.x - deltaX,
			y: pos.y - deltaY
		}));
	};

	const zoom = (adjustedX: number, adjustedY: number) => {
		set({
			x: adjustedX,
			y: adjustedY
		});
	};

	return {
		subscribe,
		move,
		zoom
	};
};

export const createScale = () => {
	const { subscribe, set, update } = writable<number>(1);

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
