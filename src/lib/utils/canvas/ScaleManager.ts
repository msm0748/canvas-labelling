import { canvasStore } from '$stores/canvas';
import { get } from 'svelte/store';

export default class ScaleManager {
	private $scale = canvasStore.scale;
	private $viewPos = canvasStore.viewPos;

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

	public handleWheel(e: WheelEvent) {
		e.preventDefault();
		const { ctrlKey, metaKey, deltaX, deltaY, offsetX, offsetY } = e;

		if (ctrlKey || metaKey) {
			this.canvasZoom(offsetX, offsetY, deltaY);
		} else {
			this.canvasMove(deltaX, deltaY);
		}
	}
}
