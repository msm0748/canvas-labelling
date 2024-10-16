import { canvasStore } from '$stores/canvas';
import { get } from 'svelte/store';

export const clearRect = (ctx: CanvasRenderingContext2D) => {
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.restore();
};

export const setTransform = (ctx: CanvasRenderingContext2D) => {
	const scale = get(canvasStore.scale);
	const viewPos = get(canvasStore.viewPos);
	ctx.setTransform(scale, 0, 0, scale, viewPos.x, viewPos.y);
};
