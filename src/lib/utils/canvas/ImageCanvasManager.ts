import { INITIAL_POSITION } from '$lib/constants/canvas';
import { canvasStore } from '$stores/canvas';
import { get } from 'svelte/store';
import { clearRect, setTransform } from './common/canvasUtils';

export default class ImageCanvasManager {
	private _ctx: CanvasRenderingContext2D;
	private _startPos = INITIAL_POSITION;
	private _isTouch = false; // 마우스 스타일 때문에 전역으로 뺄 수도 있음
	private _isGrabbing = false; // 마우스 스타일 때문에 전역으로 뺄 수도 있음

	selectedTool = canvasStore.selectedTool;
	viewPos = canvasStore.viewPos;
	scale = canvasStore.scale;
	imageInfo = canvasStore.imageInfo;
	mouseCursorStyle = canvasStore.mouseCursorStyle;

	constructor(ctx: CanvasRenderingContext2D, canvasController: HTMLElement) {
		this._ctx = ctx;
		canvasController.addEventListener('mousedown', this.handleMouseDown);
		canvasController.addEventListener('mousemove', this.handleMouseMove);
		canvasController.addEventListener('mouseup', this.handleMouseUp);
		canvasController.addEventListener('wheel', this.handleWheel);
	}

	draw = () => {
		clearRect(this._ctx);
		setTransform(this._ctx);

		const imageInfo = get(this.imageInfo);

		if (imageInfo) {
			this._ctx.drawImage(
				imageInfo.element,
				imageInfo.x,
				imageInfo.y,
				imageInfo.width,
				imageInfo.height
			);
		}
	};

	private setMouseCursorStyle = () => {
		if (get(this.selectedTool) !== 'move') return;
		if (this._isGrabbing) return this.mouseCursorStyle.set('grabbing');
		this.mouseCursorStyle.set('grab');
	};

	handleMouseDown = (e: MouseEvent) => {
		if (e.button === 2) return;
		const { offsetX, offsetY } = e;

		this._isTouch = true;

		this._startPos = {
			x: offsetX - get(this.viewPos).x,
			y: offsetY - get(this.viewPos).y
		};

		if (get(this.selectedTool) === 'move') this._isGrabbing = true;
	};

	handleMouseMove = (e: MouseEvent) => {
		const { offsetX, offsetY } = e;
		this.setMouseCursorStyle();

		if (this._isTouch && this._isGrabbing) {
			this.viewPos.set({
				x: offsetX - this._startPos.x,
				y: offsetY - this._startPos.y
			});
		}
	};

	handleMouseUp = () => {
		this._isTouch = false;
		this._isGrabbing = false;
	};

	handleWheel = (e: WheelEvent) => {
		e.preventDefault();
		const { ctrlKey, metaKey, deltaX, deltaY, offsetX, offsetY } = e;

		ctrlKey || metaKey
			? this.onZoomByWheel(offsetX, offsetY, deltaY)
			: this.moveImageByWheel(deltaX, deltaY);

		// this.draw();
	};

	onZoomByWheel = (offsetX: number, offsetY: number, deltaY: number) => {
		const xs = (offsetX - get(this.viewPos).x) / get(this.scale);
		const ys = (offsetY - get(this.viewPos).y) / get(this.scale);

		-deltaY > 0 ? this.scale.setScale('zoomIn') : this.scale.setScale('zoomOut');

		this.viewPos.set({
			x: offsetX - xs * get(this.scale),
			y: offsetY - ys * get(this.scale)
		});
	};

	moveImageByWheel = (deltaX: number, deltaY: number) => {
		const x = get(this.viewPos).x - deltaX;
		const y = get(this.viewPos).y - deltaY;

		this.viewPos.set({ x, y });
	};
}
