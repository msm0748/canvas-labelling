import {
	INITIAL_HISTORY,
	INITIAL_SAM,
	MAX_SCALE,
	MIN_SCALE,
	ZOOM_SENSITIVITY
} from '$lib/constants/canvas';
import { calculateAbsolutePositionFromRelative } from '$lib/utils/canvas/common/mousePositionCalculator';
import { Polygon } from '$lib/utils/canvas/polygon/Polygon';
import type { HistoryStore, Point, Sam, SamHistory, SamPoint, Shape, Zoom } from '$types/Canvas';
import { get, writable } from 'svelte/store';
import { canvasStore } from './index';

export const createHistory = <T>() => {
	const { set, subscribe, update } = writable<HistoryStore<T>>(INITIAL_HISTORY);

	const setState = (action: T[], overwrite = false) => {
		update((state) => {
			if (overwrite) {
				const historyCopy = [...state.history];

				historyCopy[state.index] = action;

				return {
					history: historyCopy,
					index: state.index
				};
			} else {
				// 되돌리기 하고 새로운 배열을 추가 했을 때 뒤에 있는 배열을 날리기 위함
				const updatedState = state.history.slice(0, state.index + 1);
				const newHistory = [...updatedState, action];

				if (newHistory.length > 15) {
					newHistory.shift();
					return {
						history: newHistory,
						index: state.index
					};
				}
				return {
					history: newHistory,
					index: state.index + 1
				};
			}
		});
	};

	const undo = () => {
		update((state) => {
			if (state.index > 0) {
				return { ...state, index: state.index - 1 };
			}
			return state;
		});
	};

	const redo = () => {
		update((state) => {
			if (state.index < state.history.length - 1) {
				return { ...state, index: state.index + 1 };
			}
			return state;
		});
	};

	const reset = () => {
		set(INITIAL_HISTORY);
	};

	return {
		subscribe,
		setState,
		undo,
		redo,
		reset
	};
};

export const createSelectedElement = () => {
	const { subscribe, update, set } = writable<Shape | null>(null);

	const select = (element: Shape) => {
		set(element);
	};

	const updatePoints = (newPoints: Point[]) => {
		update((selectedElement) => {
			if (selectedElement) {
				selectedElement.points = newPoints;
			}
			return selectedElement;
		});
	};

	const updateClass = (name: string, color: string) => {
		update((selectedElement) => {
			if (selectedElement) {
				selectedElement.label = name;
				selectedElement.color = color;
			}
			return selectedElement;
		});
	};

	const unselect = () => {
		set(null);
	};

	return {
		subscribe,
		select,
		updatePoints,
		updateClass,
		unselect
	};
};

export const createScale = () => {
	const { subscribe, set, update } = writable<number>(1);

	const setScale = (type: Zoom) => {
		switch (type) {
			case 'zoomIn':
				update((scale) => {
					if (scale < MAX_SCALE - ZOOM_SENSITIVITY) {
						return scale + ZOOM_SENSITIVITY;
					}
					return scale;
				});
				break;
			case 'zoomOut':
				update((scale) => {
					if (scale > MIN_SCALE + ZOOM_SENSITIVITY) {
						return scale - ZOOM_SENSITIVITY;
					}
					return scale;
				});
				break;

			case 'reset':
				set(1);
				break;
			default:
				break;
		}
	};

	const reset = () => set(1);

	return {
		subscribe,
		setScale,
		reset
	};
};
