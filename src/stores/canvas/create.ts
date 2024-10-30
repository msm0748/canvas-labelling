import {
	INITIAL_BRIGHTNESS,
	INITIAL_CONTRAST,
	INITIAL_HISTORY,
	INITIAL_POSITION,
	INITIAL_SCALE,
	INITIAL_SELECTED_TOOL,
	MAX_SCALE,
	MIN_SCALE,
	ZOOM_SENSITIVITY
} from '$lib/constants/canvas';
import type { HistoryStore, Position, SelectedClass, Shape, Tool } from '$types/Canvas';
import { writable } from 'svelte/store';

export const createHistoryStore = <T>() => {
	const { set, subscribe, update } = writable<HistoryStore<T>>(INITIAL_HISTORY);

	/**
	 * @param action element의 배열
	 * @param overwrite 되돌리기 후 새로운 배열을 추가할 때 덮어쓸지 여부
	 */
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

export const createElementsStore = () => {
	const { subscribe, set, update } = writable<Shape[]>([]);

	const reset = () => set([]);

	return {
		subscribe,
		set,
		reset,
		update
	};
};

export const createSelectedElementStore = () => {
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

export const createViewPosStore = () => {
	const { subscribe, set } = writable<Position>(INITIAL_POSITION);

	const reset = () => set(INITIAL_POSITION);
	return {
		subscribe,
		set,
		reset
	};
};

/** 클래스 선택하는 함수 */
export const createSelectedClassStore = () => {
	const { subscribe, set } = writable<SelectedClass>({ id: 0, label: 'seagull', color: '#0094FF' });

	const select = (id: number, label: string, color: string) => {
		set({ id, label, color });
	};

	return {
		subscribe,
		select
	};
};

export const createSelectedToolStore = () => {
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

export const createCanvasBrightness = () => {
	const { subscribe, set } = writable<number>(INITIAL_BRIGHTNESS);

	const reset = () => set(INITIAL_BRIGHTNESS);

	return {
		subscribe,
		set,
		reset
	};
};

export const createCanvasContrast = () => {
	const { subscribe, set } = writable<number>(INITIAL_CONTRAST);

	const reset = () => set(INITIAL_CONTRAST);

	return {
		subscribe,
		set,
		reset
	};
};

export const createScaleStore = () => {
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
		set,
		zoomIn,
		zoomOut,
		reset
	};
};
