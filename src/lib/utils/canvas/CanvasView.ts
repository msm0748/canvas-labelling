import { INITIAL_BRIGHTNESS, INITIAL_CONTRAST } from '$lib/constants/canvas';
import { canvasStore } from '$stores/canvas';
import { get } from 'svelte/store';

export default class CanvasView {
	public ctx: CanvasRenderingContext2D;
	private animationFrameId: number | null = null;
	private static instance: CanvasView | null = null;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;

		if (CanvasView.instance) {
			return CanvasView.instance;
		}

		CanvasView.instance = this;
	}

	private clearRect = () => {
		this.ctx.save();
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.restore();
	};

	private setTransform = () => {
		const scale = get(canvasStore.scale);
		const viewPos = get(canvasStore.viewPos);
		this.ctx.setTransform(scale, 0, 0, scale, viewPos.x, viewPos.y);
	};

	private shapeDraw = () => {
		const elements = get(canvasStore.elements);
		elements.forEach((element) => element.draw(this.ctx));
	};

	private imageDraw = () => {
		const imageInfo = get(canvasStore.imageInfo);

		if (imageInfo) {
			this.ctx.drawImage(
				imageInfo.element,
				imageInfo.x,
				imageInfo.y,
				imageInfo.width,
				imageInfo.height
			);
		}
	};

	private draw = () => {
		this.clearRect();
		this.setTransform();
		this.ctx.filter = `brightness(${get(canvasStore.brightness)}%) contrast(${get(canvasStore.contrast)}%)`;
		this.imageDraw();
		this.ctx.filter = `brightness(${INITIAL_BRIGHTNESS}%) contrast(${INITIAL_CONTRAST}%)`;
		this.shapeDraw();
	};

	public animateDraw = () => {
		this.draw();
		this.animationFrameId = requestAnimationFrame(this.animateDraw);
	};

	private stopAnimation = () => {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	};

	public destroy = () => {
		this.stopAnimation();
		CanvasView.instance = null;
	};
}
