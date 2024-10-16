<script lang="ts">
	import { canvasStore } from '$stores/canvas';
	import type { Classes, Shape } from '$types/canvas';
	import { getContext } from 'svelte';
	import _ from 'lodash';
	import { updateElements } from '$stores/canvas/functions';
	import ClassBadge from '$lib/components/common/badge/ClassBadge.svelte';

	let classes: Classes[] = getContext('classes');
	let { elements, selectedElement, selectedTool, applyHoverEffectById, selectedClass } =
		canvasStore;
	let classValue = '';
	$: filteredClass = classes;

	const filteredClasses = () => {
		filteredClass = classes.filter((item) => item.name.includes(classValue));
	};
</script>

<div>
	<div class="top">
		<div class="title"><span>Class</span></div>
		<!-- <SearchInput bind:searchValue={classValue} handleSearch={filteredClasses} size="sm" /> -->
		<input type="text" />
	</div>
	<div class="bottom">
		<div>
			<ul class="classes">
				{#each filteredClass as item, index}
					<li class:active={$selectedElement?.label === item.name}>
						<button
							on:click={() => {
								selectedClass.set({ name: item.name, color: item.color });
							}}
						>
							<ClassBadge label={item.name} color={item.color} />
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style lang="scss">
	.top {
		.title {
			font-weight: 600;
			font-size: 18px;
			margin-bottom: 14px;
		}
	}

	.bottom {
		margin-top: 14px;
		height: 144px;
		overflow-y: auto;

		.classes {
			display: flex;
			flex-direction: column;
			gap: 5px;
		}
	}
</style>
