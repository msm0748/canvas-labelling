<script lang="ts">
	import { INITIAL_SIZE } from '$lib/constants/canvas';
	import { onDestroy, onMount } from 'svelte';
	import { adjustImageToCanvas } from '$lib/utils/canvas/common/adjustImageToCanvas';
	import { canvasStore } from '$stores/canvas';
	import MouseController from '$lib/utils/canvas/MouseController';
	import Options from './options/Options.svelte';
	import CanvasView from '$lib/utils/canvas/CanvasView';
	import KeyboardController from '$lib/utils/canvas/KeyboardController';

	export let imageSrc: string;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let size = INITIAL_SIZE;
	let canvasController: HTMLDivElement;

	let mouseController: MouseController;
	let canvasView: CanvasView;
	let keyboardController = new KeyboardController();

	let { imageInfo, canvasSize, mouseCursorStyle, selectedTool } = canvasStore;

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

		mouseController = new MouseController(ctx);
		canvasView = new CanvasView(ctx);

		const image = new Image();
		image.src = imageSrc;

		image.onload = () => {
			setImage(image);
			canvasView.animateDraw();
		};
	});

	onDestroy(() => {
		if (mouseController) {
			mouseController.destroy();
		}

		if (canvasView) {
			canvasView.destroy();
		}

		keyboardController.destroy();
	});

	// 마우스 커서 스타일 적용
	$: {
		switch ($selectedTool) {
			case 'move':
				mouseCursorStyle.set('grab');
				break;

			default:
				mouseCursorStyle.set('default');
				break;
		}
	}
</script>

<div class="wrap">
	<div
		class="canvas-wrap"
		id="canvas-controller"
		style="cursor: {$mouseCursorStyle};"
		bind:this={canvasController}
		bind:offsetWidth={size.width}
		bind:offsetHeight={size.height}
		on:mousedown={mouseController.onMouseDown}
		on:mousemove={mouseController.onMouseMove}
		on:mouseup={mouseController.onMouseUp}
		on:contextmenu|preventDefault={mouseController.onContextmenu}
		on:wheel={mouseController.onMouseWheel}
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

<svelte:window on:keydown={keyboardController.onKeyDown} on:keyup={keyboardController.onKeyUp} />

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
