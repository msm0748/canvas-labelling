import { MAX_SCALE, MIN_SCALE, ZOOM_SENSITIVITY } from '$lib/constants/canvas';
import { canvasStore } from '$stores/canvas';
import { get } from 'svelte/store';

export default class ScaleManager {
	private scale = canvasStore.scale;
	private viewPos = canvasStore.viewPos;

	private zoomIn() {
		this.scale.update((scale) => {
			if (scale < MAX_SCALE - ZOOM_SENSITIVITY) {
				return scale + ZOOM_SENSITIVITY;
			}
			return scale;
		});
	}

	private zoomOut() {
		this.scale.update((scale) => {
			if (scale > MIN_SCALE + ZOOM_SENSITIVITY) {
				return scale - ZOOM_SENSITIVITY;
			}
			return scale;
		});
	}

	private onZoomByWheel(offsetX: number, offsetY: number, deltaY: number) {
		const xs = (offsetX - get(this.viewPos).x) / get(this.scale);
		const ys = (offsetY - get(this.viewPos).y) / get(this.scale);

		if (-deltaY > 0) {
			this.zoomIn();
		} else {
			this.zoomOut();
		}

		this.viewPos.set({
			x: offsetX - xs * get(this.scale),
			y: offsetY - ys * get(this.scale)
		});
	}

	private moveImageByWheel(deltaX: number, deltaY: number) {
		const x = get(this.viewPos).x - deltaX;
		const y = get(this.viewPos).y - deltaY;

		this.viewPos.set({ x, y });
	}

	public handleWheel(e: WheelEvent) {
		e.preventDefault();
		const { ctrlKey, metaKey, deltaX, deltaY, offsetX, offsetY } = e;

		if (ctrlKey || metaKey) {
			this.onZoomByWheel(offsetX, offsetY, deltaY);
		} else {
			this.moveImageByWheel(deltaX, deltaY);
		}

		console.log('오나용');
	}
}
