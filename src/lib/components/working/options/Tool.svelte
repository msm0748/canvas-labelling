<script lang="ts">
	import FeaturePointIcon from '$lib/components/ui/common/icons/FeaturePointIcon.svelte';
	import GrabIcon from '$lib/components/ui/common/icons/GrabIcon.svelte';
	import RectangleIcon from '$lib/components/ui/common/icons/RectangleIcon.svelte';
	import RedoIcon from '$lib/components/ui/common/icons/RedoIcon.svelte';
	import SelectorIcon from '$lib/components/ui/common/icons/SelectorIcon.svelte';
	import SmartPolygon from '$lib/components/ui/common/icons/SmartPolygon.svelte';
	import UndoIcon from '$lib/components/ui/common/icons/UndoIcon.svelte';
	import PolygonIcon from '$lib/components/ui/common/icons/PolygonIcon.svelte';
	import { canvasStore } from '$stores/canvas';
	import type { Label, Tool } from '$types/Canvas';
	import { getContext } from 'svelte';
	import { redo, undo } from '$stores/canvas/functions';
	import CommentIcon from '$lib/components/ui/common/icons/CommentIcon.svelte';

	const { selectedTool, selectedElement } = canvasStore;
	const label: Label = getContext('label');

	const onChange = (tool: Tool) => {
		selectedTool.set(tool);
		if (tool === 'polygon') {
			selectedElement.unselect();
		}
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions (because of reasons) -->
<div class="wrap" on:click|stopPropagation>
	<button on:click={() => onChange('select')} class:active={'select' === $selectedTool}>
		<SelectorIcon />
	</button>
	<button on:click={() => onChange('move')} class:active={'move' === $selectedTool}>
		<GrabIcon />
	</button>
	{#if label === 'polygon'}
		<button on:click={() => onChange('polygon')} class:active={'polygon' === $selectedTool}>
			<PolygonIcon />
		</button>
		<button
			on:click={() => onChange('smartPolygon')}
			class:active={'smartPolygon' === $selectedTool}
		>
			<SmartPolygon />
		</button>
	{/if}
	{#if label === 'rectangle'}
		<button on:click={() => onChange('rectangle')} class:active={'rectangle' === $selectedTool}>
			<RectangleIcon />
		</button>
	{/if}
	{#if label === 'featurePoint'}
		<button
			on:click={() => onChange('featurePoint')}
			class:active={'featurePoint' === $selectedTool}
		>
			<FeaturePointIcon />
		</button>
	{/if}

	<div class="divider"></div>
	<button on:click={() => onChange('comment')} class:active={'comment' === $selectedTool}>
		<CommentIcon />
	</button>
	<button on:click={undo}>
		<UndoIcon />
	</button>
	<button on:click={redo}>
		<RedoIcon />
	</button>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		gap: 10px;
		position: absolute;
		z-index: 99;
		top: 50%;
		transform: translateY(-50%);
		right: 20px;
		background-color: #f5f5f5;
		padding: 10px;
		border-radius: 10px;

		button {
			padding: 2px;
			&:focus {
				outline: none;
			}
			&.active {
				background-color: skyblue;
			}
		}

		.divider {
			height: 1px;
			background-color: #bbb;
		}
	}
</style>
