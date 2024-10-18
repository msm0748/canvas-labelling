import { get } from 'svelte/store';
import ImageManager from './ImageManager';
import ScaleManager from './ScaleManager';
import { canvasStore } from '$stores/canvas';
import { RectangleManager } from './shape/rectangle/RectangleManager';

export default class Controller {
	public ctx: CanvasRenderingContext2D;
	private animationFrameId: number | null = null;
	private scaleManager: ScaleManager; // ScaleManager의 인스턴스를 속성으로 저장
	private imageManager: ImageManager;
	private rectangleManager: RectangleManager;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.scaleManager = new ScaleManager(); // 생성자에서 인스턴스를 생성
		this.imageManager = new ImageManager();
		this.rectangleManager = new RectangleManager(ctx);
	}

	public onMouseDown = (e: MouseEvent) => {
		const { offsetX, offsetY } = e;
		this.rectangleManager.onMouseDown(offsetX, offsetY);
	};

	public onMouseMove = (e: MouseEvent) => {
		const { offsetX, offsetY } = e;
		this.rectangleManager.onMouseMove(offsetX, offsetY);
	};

	public onMouseUp = (e: MouseEvent) => {
		const { offsetX, offsetY } = e;
		this.rectangleManager.onMouseUp(offsetX, offsetY);
	};

	public onMouseWheel = (e: WheelEvent) => {
		this.scaleManager.handleWheel(e);
	};

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

	private draw = () => {
		this.clearRect();
		this.setTransform();
		this.imageManager.draw(this.ctx);
		this.rectangleManager.draw();
	};

	public animateDraw = () => {
		this.draw();
		this.animationFrameId = requestAnimationFrame(this.animateDraw);
	};

	public stopAnimation = () => {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	};
}
