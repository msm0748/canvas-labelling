import { get } from 'svelte/store';
import { canvasStore } from '$stores/canvas';
import { RectangleManager } from './shape/rectangle/RectangleManager';
import { relativeMousePos } from './common/mousePositionCalculator';
import { INITIAL_POSITION } from '$lib/constants/canvas';

export default class MouseController {
	public ctx: CanvasRenderingContext2D;
	private rectangleManager: RectangleManager;
	private static instance: MouseController | null = null;
	private $scale = canvasStore.scale;
	private $viewPos = canvasStore.viewPos;
	private $selectedTool = canvasStore.selectedTool;
	private $mouseCursorStyle = canvasStore.mouseCursorStyle;

	private startPos = INITIAL_POSITION;
	/** 캔버스를 움직일 때 필요한 변수 */
	private isTouch = false;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.rectangleManager = new RectangleManager();

		if (MouseController.instance) {
			return MouseController.instance;
		}

		MouseController.instance = this;
	}

	public onMouseDown = (e: MouseEvent) => {
		const { offsetX, offsetY } = e;
		const { x, y } = relativeMousePos(offsetX, offsetY);

		// e.button === 0: 왼쪽 마우스 클릭시
		// e.button === 1: 마우스 휠 클릭시
		// e.button === 2: 오른쪽 마우스 클릭시

		if (e.button === 1) return; // 마우스 휠 클릭시

		/** 마우스 우클릭 여부 */
		const isContextmenu = e.button === 2 ? true : false;

		if (get(this.$selectedTool) === 'move') {
			this.startPos = { x: offsetX - get(this.$viewPos).x, y: offsetY - get(this.$viewPos).y };
			this.isTouch = true;
			this.$mouseCursorStyle.set('grabbing');
		}

		if (isContextmenu) {
			this.rectangleManager.onRightMouseDown(x, y);
		} else {
			this.rectangleManager.onLeftMouseDown(x, y);
		}
	};

	public onMouseMove = (e: MouseEvent) => {
		const { offsetX, offsetY } = e;
		const { x, y } = relativeMousePos(offsetX, offsetY);

		this.rectangleManager.onMouseMove(x, y);

		if (get(this.$selectedTool) === 'move' && this.isTouch) {
			const { x: sX, y: sY } = this.startPos;
			this.$viewPos.set({ x: offsetX - sX, y: offsetY - sY });
		}
	};

	public onMouseUp = (e: MouseEvent) => {
		this.isTouch = false;
		if (get(this.$selectedTool) === 'move') {
			this.$mouseCursorStyle.set('grab');
			// 도형을 그리는 중 캔버스를 이동할 때는 도형을 그리는 동작을 하지 않도록 return
			return;
		}

		const { offsetX, offsetY } = e;
		const { x, y } = relativeMousePos(offsetX, offsetY);

		this.rectangleManager.onMouseUp(x, y);
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
