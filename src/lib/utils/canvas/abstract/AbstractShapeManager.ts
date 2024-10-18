import { canvasStore } from '$stores/canvas';
import type { Action, Position } from '$types/canvas';

export default abstract class AbstractShapeManager {
	public ctx: CanvasRenderingContext2D;
	public action: Action = 'none';
	public $selectedClass = canvasStore.selectedClass;
	public $selectedTool = canvasStore.selectedTool;
	public $selectedElement = canvasStore.selectedElement;
	public $elements = canvasStore.elements;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	abstract createElement(offsetX: number, offsetY: number): void;
	abstract selectElement(offsetX: number, offsetY: number): void;
	abstract onMouseDown(offsetX: number, offsetY: number): void;
	abstract onMouseMove(offsetX: number, offsetY: number): void;
	abstract onMouseUp(offsetX: number, offsetY: number): void;

	/**
	 * @param {Position | null} relativeMousePos - 폴리곤을 그리는 동안 마우스의 현재 위치를 사용하여 선을 연결하기 위한 좌표,
	 */
	abstract draw(relativeMousePos: Position | null): void;
}
