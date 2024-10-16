import { get } from 'svelte/store';
import { canvasStore } from './../../../stores/canvas';
import { clearRect, setTransform } from './common/canvasUtils';
import { relativeMousePos } from './common/mousePositionCalculator';
import { INITIAL_POSITION } from '$lib/constants/canvas';
import { PolygonManager } from './polygon/PolygonManager';
import { RectangleManager } from './rectangle/RectangleManager';
import { FeaturePointManager } from './featurePoint/FeaturePointManager';
import type { Label } from '$types/canvas';

export class ShapeManager {
	private _relativeMousePos = INITIAL_POSITION;
	private ctx: CanvasRenderingContext2D;
	private controller: PolygonManager | RectangleManager | FeaturePointManager;
	private animationFrameId: number | null = null;
	private static instance: ShapeManager | null = null;

	private canvasController: HTMLElement;

	constructor(ctx: CanvasRenderingContext2D, canvasController: HTMLElement, label: Label) {
		if (ShapeManager.instance) {
			return ShapeManager.instance;
		}

		ShapeManager.instance = this;

		switch (label) {
			case 'polygon':
				this.controller = new PolygonManager(ctx);
				break;
			case 'rectangle':
				this.controller = new RectangleManager(ctx);
				break;
			case 'featurePoint':
				this.controller = new FeaturePointManager(ctx);
				break;
		}

		this.canvasController = canvasController;

		this.ctx = ctx;

		this.canvasController.addEventListener('mousedown', this.handleMouseDown);
		this.canvasController.addEventListener('mousemove', this.handleMouseMove);
		this.canvasController.addEventListener('mouseup', this.handleMouseUp);
		this.canvasController.addEventListener('dblclick', this.handleDbClick);
		this.canvasController.addEventListener('wheel', this.handleWheel);
	}

	// 인스턴스가 파괴되면 이벤트 리스너를 정리
	destroy() {
		this.canvasController.removeEventListener('mousedown', this.handleMouseDown);
		this.canvasController.removeEventListener('mousemove', this.handleMouseMove);
		this.canvasController.removeEventListener('mouseup', this.handleMouseUp);
		this.canvasController.removeEventListener('dblclick', this.handleDbClick);
		this.canvasController.removeEventListener('wheel', this.handleWheel);
		ShapeManager.instance = null;
	}

	private handleMouseDown = (e: MouseEvent) => {
		// 마우스 우클릭 했을 때 폴리곤이 날라가는 현상 방지
		const target = e.target as Element;
		if (target.nodeName !== 'CANVAS') return;

		const isContextMenu = e.button === 2;

		const { x: offsetX, y: offsetY } = this._relativeMousePos;

		// isContextMenu는 마우스 우클릭 여부 (우클릭시 element 수정 불가)
		this.controller.handleMouseDown(offsetX, offsetY, isContextMenu);
	};

	private handleMouseMove = (e: MouseEvent) => {
		// 마우스 우클릭 했을 때 폴리곤이 날라가는 현상 방지
		const target = e.target as Element;
		if (target.nodeName !== 'CANVAS') return;

		this._relativeMousePos = relativeMousePos(e.offsetX, e.offsetY);

		const { x: offsetX, y: offsetY } = this._relativeMousePos;

		this.controller.handleMouseMove(offsetX, offsetY);
	};

	private handleMouseUp = () => {
		const { x: offsetX, y: offsetY } = this._relativeMousePos;
		this.controller.handleMouseUp(offsetX, offsetY);
	};

	private handleDbClick = () => {
		const { x: offsetX, y: offsetY } = this._relativeMousePos;
		if (this.controller instanceof PolygonManager) this.controller.handleDbClick(offsetX, offsetY);
	};

	private handleWheel = (e: WheelEvent) => {
		this._relativeMousePos = relativeMousePos(e.offsetX, e.offsetY);
	};

	private drawCrosshair() {
		const selectedTool = get(canvasStore.selectedTool);
		const { x: offsetX, y: offsetY } = this._relativeMousePos;

		if (
			selectedTool !== 'polygon' &&
			selectedTool !== 'rectangle' &&
			selectedTool !== 'smartPolygon' &&
			selectedTool !== 'featurePoint'
		)
			return;
		const scale = get(canvasStore.scale);
		const viewPos = get(canvasStore.viewPos);

		this.ctx.save();
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);

		const canvasWidth = this.ctx.canvas.width;
		const canvasHeight = this.ctx.canvas.height;

		// viewPos와 scale을 고려하여 crosshair 위치 계산
		const crosshairX = offsetX * scale + viewPos.x;
		const crosshairY = offsetY * scale + viewPos.y;

		this.ctx.beginPath();
		this.ctx.setLineDash([8, 4]);
		this.ctx.moveTo(0, crosshairY);
		this.ctx.lineTo(canvasWidth, crosshairY);
		this.ctx.moveTo(crosshairX, 0);
		this.ctx.lineTo(crosshairX, canvasHeight);

		this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
		this.ctx.lineWidth = 1;
		this.ctx.stroke();

		this.ctx.restore();
	}

	private animateDraw = () => {
		clearRect(this.ctx);
		setTransform(this.ctx);
		this.controller.draw(this._relativeMousePos);
		this.drawCrosshair();

		this.animationFrameId = requestAnimationFrame(this.animateDraw);
	};

	draw() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
		}
		this.animationFrameId = requestAnimationFrame(this.animateDraw);
	}

	stopAnimation() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}
}
