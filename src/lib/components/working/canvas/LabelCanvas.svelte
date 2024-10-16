<script lang="ts">
	import { ShapeManager } from '$lib/utils/canvas/ShapeManager';
	import type { Label, Size } from '$types/canvas';
	import { getContext, onDestroy, onMount } from 'svelte';

	export let canvasController: HTMLDivElement;
	export let size: Size;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;

	let controller: ShapeManager;

	const label: Label = getContext('label');

	onMount(() => {
		ctx = canvas.getContext('2d');

		if (!ctx) return;
		controller = new ShapeManager(ctx, canvasController, label);
		controller.draw();
	});

	onDestroy(() => {
		controller.destroy();
		controller.stopAnimation();
	});
</script>

<canvas bind:this={canvas} width={size.width} height={size.height} />

<style lang="scss">
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
</style>
