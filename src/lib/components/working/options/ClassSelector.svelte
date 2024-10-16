<script lang="ts">
	import { CLASS_COLORS } from '$lib/constants/classColor';
	import { canvasStore } from '$stores/canvas';
	import type { Classes } from '$types/canvas';
	import { getContext, onMount } from 'svelte';

	let classes: Classes[] = getContext('classes');

	onMount(() => {
		selectedClass.set({ name: classes[0].name, color: CLASS_COLORS[0] });
	});

	let { selectedElement, selectedTool, selectedClass } = canvasStore;

	// 마지막 selectedElement이 존재할 경우, classSelectorStore에 저장
	// $: if ($selectedElement) {
	// 	classSelectorStore.set({ name: $selectedElement.label, color: $selectedElement.color });
	// }
</script>

<div
	class="wrap"
	class:hidden={!['polygon', 'smartPolygon', 'rectangle', 'featurePoint'].includes($selectedTool)}
>
	<ol>
		{#each classes as item, index}
			<li class:active={$selectedClass.name === item.name}>
				<button
					on:click={() => {
						selectedClass.set({ name: item.name, color: CLASS_COLORS[index] });
					}}
				>
					<div class="shortcut">
						{index + 1}
					</div>
					<div class="label">
						{item.name}
					</div>
					<div class="color" style="background-color: {CLASS_COLORS[index]}"></div>
				</button>
			</li>
		{/each}
	</ol>
</div>

<style lang="scss">
	.wrap {
		position: absolute;
		top: 20px;
		left: 20px;
		border-radius: 15px;
		z-index: 99;
		background-color: #111827;
		min-width: 200px;

		&.hidden {
			display: none;
		}

		ol {
			padding: 10px;

			li {
				&:hover {
					background-color: #3c4e66;
				}

				&.active {
					background-color: #658bbb;
				}

				button {
					width: 100%;
					padding: 4px 10px;
					cursor: pointer;
					display: flex;
					gap: 4px;
					align-items: center;
					margin: 4px 0;
					color: #fff;

					.shortcut {
						border: 1px solid #aaa;
						border-radius: 3px;
						font-size: 9px;
						margin: 4px 8px 4px 9px;
						min-width: 20px;
						padding: 1px 0;
						text-align: center;
					}

					.label {
						flex: 1;
						text-align: left;
					}

					.color {
						width: 10px;
						height: 10px;
						border-radius: 20px;
					}
				}
			}
		}
	}
</style>
