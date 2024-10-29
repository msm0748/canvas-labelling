<script lang="ts">
	import { getContext } from 'svelte';

	const classes = getContext('classes');
</script>

<div class="wrap">
	<div class="title">Class</div>
	<div class="input-wrap"><input type="text" /></div>
	<ul class="classList">
		{#each classes as classItem}
			<li class="classItem">
				<div
					style="width: 10px; height: 10px; background-color:{classItem.color}; border-radius: 3px;"
				></div>
				<div>{classItem.name}</div>
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

		.classItem {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			gap: 5px;
		}
	}
</style>
