import { canvasStore } from '$stores/canvas';
import type { Position } from '$types/canvas';

export default abstract class ShapeManager {
	protected ctx: CanvasRenderingContext2D;

	// 전역
	history = canvasStore.history;
	selectedElement = canvasStore.selectedElement;
	selectedClass = canvasStore.selectedClass;
	selectedTool = canvasStore.selectedTool;
	action = canvasStore.action;
	scale = canvasStore.scale;
	mouseCursorStyle = canvasStore.mouseCursorStyle;
	applyHoverEffectById = canvasStore.applyHoverEffectById;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	protected abstract createElement(offsetX: number, offsetY: number, isContextMenu: boolean): void;
	protected abstract selectElement(offsetX: number, offsetY: number, isContextMenu: boolean): void;
	abstract handleMouseDown(offsetX: number, offsetY: number, isContextMenu: boolean): void;
	abstract handleMouseMove(offsetX: number, offsetY: number): void;
	abstract handleMouseUp(offsetX: number, offsetY: number): void;
	abstract draw(relativeMousePos: Position | null): void;
}
