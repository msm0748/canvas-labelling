import { get } from 'svelte/store';
import { canvasStore } from '$stores/canvas';
import { RectangleManager } from './shape/rectangle/RectangleManager';
import { relativeMousePos } from './common/mousePositionCalculator';

export default class MouseController {
	public ctx: CanvasRenderingContext2D;
	private rectangleManager: RectangleManager;
	private static instance: MouseController | null = null;
	private $scale = canvasStore.scale;
	private $viewPos = canvasStore.viewPos;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.rectangleManager = new RectangleManager(ctx);

		if (MouseController.instance) {
			return MouseController.instance;
		}

		MouseController.instance = this;
	}

	public onMouseDown = (e: MouseEvent) => {
		const { offsetX, offsetY } = e;
		const { x, y } = relativeMousePos(offsetX, offsetY);

		// 왼쪽 마웃드 클릭시에만
		if (e.button === 0) {
			this.rectangleManager.onMouseDown(x, y);
		}
	};

	public onMouseMove = (e: MouseEvent) => {
		const { offsetX, offsetY } = e;
		const { x, y } = relativeMousePos(offsetX, offsetY);
		this.rectangleManager.onMouseMove(x, y);
	};

	public onMouseUp = (e: MouseEvent) => {
		// console.log(e);
		// const { offsetX, offsetY } = e;
		// const { x, y } = relativeMousePos(offsetX, offsetY);
		this.rectangleManager.onMouseUp();
	};

	private canvasZoom(offsetX: number, offsetY: number, deltaY: number) {
		const xs = (offsetX - get(this.$viewPos).x) / get(this.$scale);
		const ys = (offsetY - get(this.$viewPos).y) / get(this.$scale);

		if (-deltaY > 0) {
			this.$scale.zoomIn();
		} else {
			this.$scale.zoomOut();
		}

		const adjustedX = offsetX - xs * get(this.$scale);
		const adjustedY = offsetY - ys * get(this.$scale);

		this.$viewPos.set({ x: adjustedX, y: adjustedY });
	}

	private canvasMove(deltaX: number, deltaY: number) {
		const x = get(this.$viewPos).x - deltaX;
		const y = get(this.$viewPos).y - deltaY;
		this.$viewPos.set({ x, y });
	}

	public onMouseWheel = (e: WheelEvent) => {
		e.preventDefault();
		const { ctrlKey, metaKey, deltaX, deltaY, offsetX, offsetY } = e;

		if (ctrlKey || metaKey) {
			this.canvasZoom(offsetX, offsetY, deltaY);
		} else {
			this.canvasMove(deltaX, deltaY);
		}
	};

	public destroy = () => {
		this.rectangleManager.destroy();
		MouseController.instance = null;
	};
}
