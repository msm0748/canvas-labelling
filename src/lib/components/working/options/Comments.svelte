<script lang="ts">
	import { calculateRelativePositionFromAbsolute } from '$lib/utils/canvas/common/mousePositionCalculator';
	import { canvasStore } from '$stores/canvas';
	import { derived } from 'svelte/store';

	export let offsetX = 0;
	export let offsetY = 0;

	const { viewPos, scale } = canvasStore;

	const position = derived([viewPos, scale], ([$viewPos, $scale]) => {
		const { x: relativeX, y: relativeY } = calculateRelativePositionFromAbsolute(offsetX, offsetY);
		return {
			x: relativeX * $scale + $viewPos.x,
			y: relativeY * $scale + $viewPos.y
		};
	});
</script>

<div style="transform: translate({$position.x}px, {$position.y}px);"></div>

<style lang="scss">
	div {
		position: absolute;
		z-index: 999;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: blue;
	}
</style>
