<script lang="ts">
	import ImageCanvas from './ImageCanvas.svelte';
	import LabelCanvas from './LabelCanvas.svelte';
	import { INITIAL_POSITION, INITIAL_SIZE } from '$lib/constants/canvas';
	import { onMount } from 'svelte';
	import { adjustImageToCanvas } from '$lib/utils/canvas/common/adjustImageToCanvas';
	import { canvasStore } from '$stores/canvas';
	import ContextMenuOptions from './ContextMenuOptions.svelte';
	import type { Position } from '$types/canvas';

	export let imageSrc: string;
	export let brightness: number;
	export let contrast: number;

	let isOpenContextMenu = false;
	let contextMenuPosition: Position = INITIAL_POSITION;
	let size = INITIAL_SIZE;
	let canvasController: HTMLDivElement;

	let { mouseCursorStyle, imageInfo, selectedElement, canvasSize } = canvasStore;

	onMount(() => {
		canvasSize.set(size);
		const image = new Image();
		image.src = imageSrc;

		image.onload = () => {
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
	});

	const contextmenuClick = (e: MouseEvent) => {
		e.preventDefault();
		const { clientX, clientY } = e;
		contextMenuPosition = { x: clientX, y: clientY };

		if (!$selectedElement) return (isOpenContextMenu = false);

		isOpenContextMenu = true;
	};

	const closeContextMenu = (e: MouseEvent) => {
		const target = e.target as Element;
		if (target.nodeName !== 'CANVAS') return;

		isOpenContextMenu = false;
	};
</script>

<div
	class="wrap"
	id="canvas-controller"
	style="cursor: {$mouseCursorStyle};"
	on:mousedown={closeContextMenu}
	on:contextmenu={contextmenuClick}
	bind:this={canvasController}
	bind:offsetWidth={size.width}
	bind:offsetHeight={size.height}
	tabindex="0"
	role="button"
	aria-pressed="false"
>
	{#if canvasController && $imageInfo}
		<ImageCanvas {size} {canvasController} {brightness} {contrast} />
		<LabelCanvas {size} {canvasController} />
	{/if}
	{#if isOpenContextMenu}
		<ContextMenuOptions position={contextMenuPosition} bind:isOpenContextMenu />
	{/if}
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
	}
</style>
