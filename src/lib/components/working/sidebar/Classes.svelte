<script lang="ts">
	import { getContext } from 'svelte';
	import { canvasStore } from '$stores/canvas';
	import type { ClassItem } from '$types/Canvas';

	const classes: ClassItem[] = getContext('classes');

	console.log(canvasStore);

	const { selectedClass } = canvasStore;

	$: if (classes) {
		selectedClass.select(classes[0].id, classes[0].name, classes[0].color);
	}
</script>

<div class="wrap">
	<div class="title">Class</div>
	<div class="input-wrap"><input type="text" /></div>
	<ul class="classList">
		{#each classes as classItem}
			<li class="classItem">
				<button
					on:click={() => {
						selectedClass.select(classItem.id, classItem.name, classItem.color);
					}}
				>
					<div
						style="width: 10px; height: 10px; background-color:{classItem.color}; border-radius: 3px;"
					></div>
					<div>{classItem.name}</div>
				</button>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.wrap {
		padding: 33px 40px 0 70px;
		height: 400px;
	}

	.title {
		font-size: 20px;
		font-weight: 700;
		margin-bottom: 14px;
	}

	.input-wrap {
		input {
			height: 28px;
		}

		margin-bottom: 14px;
	}

	.classList {
		height: 144px;
		overflow-y: auto;

		.classItem button {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			gap: 5px;
		}
	}
</style>
