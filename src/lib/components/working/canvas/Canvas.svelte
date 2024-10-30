<script lang="ts">
	import { INITIAL_SIZE } from '$lib/constants/canvas';
	import { onDestroy, onMount } from 'svelte';
	import { adjustImageToCanvas } from '$lib/utils/canvas/common/adjustImageToCanvas';
	import { canvasStore } from '$stores/canvas';
	import Controller from '$lib/utils/canvas/Controller';
	import Options from './options/Options.svelte';

	export let imageSrc: string;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let size = INITIAL_SIZE;
	let canvasController: HTMLDivElement;

	let controller: Controller;

	let { imageInfo, canvasSize } = canvasStore;

	/** 이미지 정보를 저장하는 함수 */
	const setImage = (image: HTMLImageElement) => {
		const adjustedImageProperties = adjustImageToCanvas(image, size);
		const originalWidth = image.width;
		const originalHeight = image.height;

		imageInfo.set({
			src: image.src,
			element: image,
			...adjustedImageProperties,
			originalWidth,
			originalHeight
		});
	};

	onMount(() => {
		ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvasSize.set(size);

		controller = new Controller(ctx);

		const image = new Image();
		image.src = imageSrc;

		image.onload = () => {
			setImage(image);
			controller.animateDraw();
		};
	});
	onDestroy(() => {
		if (controller) {
			controller.destroy();
		}
	});
</script>

<div class="wrap">
	<div
		class="canvas-wrap"
		id="canvas-controller"
		bind:this={canvasController}
		bind:offsetWidth={size.width}
		bind:offsetHeight={size.height}
		on:mousedown={controller.onMouseDown}
		on:mousemove={controller.onMouseMove}
		on:mouseup={controller.onMouseUp}
		on:contextmenu|preventDefault
		on:wheel={controller.onMouseWheel}
		tabindex="0"
		role="button"
		aria-pressed="false"
	>
		<canvas bind:this={canvas} width={size.width} height={size.height} />
	</div>
	<div class="option-control">
		<Options />
	</div>
</div>

<style lang="scss">
	.wrap {
		position: relative;
		height: 100%;
		min-width: 300px;
		background-color: #374150;

		&:focus {
			outline: none;
		}
		.canvas-wrap {
			position: relative;
			width: 100%;
			height: 100%;

			canvas {
				position: absolute;
				top: 0;
				left: 0;
			}
		}

		.option-control {
			position: absolute;
			bottom: 40px;
			left: 8px;
		}
	}
</style>
