import { get } from 'svelte/store';
import ImageManager from './ImageManager';
import ScaleManager from './ScaleManager';
import { canvasStore } from '$stores/canvas';

export default class Controller {
	public ctx: CanvasRenderingContext2D;
	private animationFrameId: number | null = null;
	private scaleManager: ScaleManager; // ScaleManager의 인스턴스를 속성으로 저장
	private imageManager: ImageManager;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.scaleManager = new ScaleManager(); // 생성자에서 인스턴스를 생성
		this.imageManager = new ImageManager();
	}

	public onMouseDown = (e: MouseEvent) => {
		console.log('마우스 다운');
	};

	public onMouseMove = (e: MouseEvent) => {
		console.log('마우스 무브');
	};

	public onMouseUp = (e: MouseEvent) => {
		console.log('마우스 업');
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
	};

	animateDraw = () => {
		this.draw();
		this.animationFrameId = requestAnimationFrame(this.animateDraw);
	};

	stopAnimation = () => {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	};
}
