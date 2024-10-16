<script lang="ts">
	import ImageCanvasManager from '$lib/utils/canvas/ImageCanvasManager';
	import { canvasStore } from '$stores/canvas';
	import type { Size } from '$types/canvas';
	import { onMount } from 'svelte';
	import { derived, type Readable } from 'svelte/store';

	export let canvasController: HTMLDivElement;
	export let size: Size;
	export let brightness: number;
	export let contrast: number;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let imageCanvasManager: ImageCanvasManager;

	const { imageInfo, viewPos, scale } = canvasStore;

	onMount(() => {
		ctx = canvas.getContext('2d');

		if (ctx) {
			imageCanvasManager = new ImageCanvasManager(ctx, canvasController);
		}
	});

	$: if (ctx) {
		ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
		imageCanvasManager.draw();
	}

	// 그리기
	let draw: Readable<unknown>;

	$: if (imageCanvasManager) {
		draw = derived([imageInfo, viewPos, scale], () => imageCanvasManager.draw());
	}
</script>

<canvas bind:this={canvas} width={size.width} height={size.height} />

<div style="display: none;">{$draw}</div>

<style lang="scss">
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
</style>
