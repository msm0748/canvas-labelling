import { canvasStore } from '$stores/canvas';
import { get } from 'svelte/store';

export default class ScaleManager {
	private $scale = canvasStore.scale;
	private $viewPos = canvasStore.viewPos;

	private zoom(offsetX: number, offsetY: number, deltaY: number) {
		const xs = (offsetX - get(this.$viewPos).x) / get(this.$scale);
		const ys = (offsetY - get(this.$viewPos).y) / get(this.$scale);

		if (-deltaY > 0) {
			this.$scale.zoomIn();
		} else {
			this.$scale.zoomOut();
		}

		const adjustedX = offsetX - xs * get(this.$scale);
		const adjustedY = offsetY - ys * get(this.$scale);

		this.$viewPos.zoom(adjustedX, adjustedY);
	}

	private move(deltaX: number, deltaY: number) {
		this.$viewPos.move(deltaX, deltaY);
	}

	public handleWheel(e: WheelEvent) {
		e.preventDefault();
		const { ctrlKey, metaKey, deltaX, deltaY, offsetX, offsetY } = e;

		if (ctrlKey || metaKey) {
			this.zoom(offsetX, offsetY, deltaY);
		} else {
			this.move(deltaX, deltaY);
		}
	}
}
