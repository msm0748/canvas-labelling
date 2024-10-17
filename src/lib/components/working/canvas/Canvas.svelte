<script lang="ts">
	import { INITIAL_SIZE } from '$lib/constants/canvas';
	import { onMount } from 'svelte';
	import { adjustImageToCanvas } from '$lib/utils/canvas/common/adjustImageToCanvas';
	import { canvasStore } from '$stores/canvas';

	export let imageSrc: string;
	export let brightness: number;
	export let contrast: number;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let size = INITIAL_SIZE;
	let canvasController: HTMLDivElement;

	let { imageInfo } = canvasStore;

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

	const imageDraw = () => {
		if (!ctx) return;

		if ($imageInfo) {
			ctx.drawImage(
				$imageInfo.element,
				$imageInfo.x,
				$imageInfo.y,
				$imageInfo.width,
				$imageInfo.height
			);
		}
	};

	onMount(() => {
		ctx = canvas.getContext('2d');

		const image = new Image();
		image.src = imageSrc;

		image.onload = () => {
			setImage(image);
			imageDraw();
		};
	});
</script>

<div
	class="wrap"
	id="canvas-controller"
	bind:this={canvasController}
	bind:offsetWidth={size.width}
	bind:offsetHeight={size.height}
	tabindex="0"
	role="button"
	aria-pressed="false"
>
	<canvas bind:this={canvas} width={size.width} height={size.height} />
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

		canvas {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
</style>
