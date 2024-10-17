import {
	INITIAL_ACTION,
	INITIAL_CLASS_SELECTOR,
	INITIAL_POSITION,
	INITIAL_RESIZE_POINT,
	INITIAL_SELECTED_TOOL,
	INITIAL_SIZE
} from '$lib/constants/canvas';
import type {
	Action,
	ImageInfo,
	MouseCursorStyle,
	Position,
	SelectedClass,
	Shape,
	Size,
	Tool
} from '$types/canvas';
import { writable } from 'svelte/store';
import { createHistory, createScale, createSelectedElement } from './create';

export const canvasStore = {
	canvasSize: writable<Size>(INITIAL_SIZE),
	selectedTool: writable<Tool>(INITIAL_SELECTED_TOOL),
	viewPos: writable<Position>(INITIAL_POSITION),
	action: writable<Action>(INITIAL_ACTION),
	selectedClass: writable<SelectedClass>(INITIAL_CLASS_SELECTOR),
	/** Elements에 마우스 hover 효과를 주기 위한 변수 */
	applyHoverEffectById: writable<string | null>(null),
	scale: createScale(),
	selectedElement: createSelectedElement(),
	imageInfo: writable<ImageInfo | null>(null),
	resizePoint: writable<number>(INITIAL_RESIZE_POINT),
	mouseCursorStyle: writable<MouseCursorStyle>('default'),
	history: createHistory<Shape>(),
	elements: writable<Shape[]>([])
};

export const resetCanvasStore = () => {
	canvasStore.selectedTool.set(INITIAL_SELECTED_TOOL);
	canvasStore.viewPos.set(INITIAL_POSITION);
	canvasStore.action.set(INITIAL_ACTION);
	canvasStore.scale.reset();
	canvasStore.selectedElement.unselect();
	canvasStore.imageInfo.set(null);
	canvasStore.resizePoint.set(INITIAL_RESIZE_POINT);
	canvasStore.mouseCursorStyle.set('default');
	canvasStore.history.reset();
	canvasStore.elements.set([]);
	// canvasStore.sam.reset();
};
