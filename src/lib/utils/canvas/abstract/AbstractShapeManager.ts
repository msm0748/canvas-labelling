import type { Position } from '$types/canvas';

export default abstract class ShapeManager {
	protected ctx: CanvasRenderingContext2D;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	protected abstract createElement(offsetX: number, offsetY: number): void;
	protected abstract selectElement(offsetX: number, offsetY: number): void;
	abstract handleMouseDown(offsetX: number, offsetY: number): void;
	abstract handleMouseMove(offsetX: number, offsetY: number): void;
	abstract handleMouseUp(offsetX: number, offsetY: number): void;

	/**
	 * @param {Position | null} relativeMousePos - 폴리곤을 그리는 동안 마우스의 현재 위치를 사용하여 선을 연결하기 위한 좌표,
	 */
	abstract draw(relativeMousePos: Position | null): void;
}
