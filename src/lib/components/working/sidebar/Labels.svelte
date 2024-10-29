<script lang="ts">
	import { canvasStore } from '$stores/canvas';

	const { elements } = canvasStore;
</script>

<div class="wrap">
	<div class="title">Label</div>
	<ul class="elements">
		{#each $elements as element, index}
			<li class="element">
				<div class="index">{index + 1}</div>
				<div class="element-label-wrap">
					<div
						style="width: 10px; height: 10px; background-color:{element.color}; border-radius: 3px;"
					></div>
					<div>{element.label}</div>
					<div>></div>
				</div>
				<div>
					<button>눈</button>
				</div>
				<div>
					<button>...</button>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.wrap {
		padding: 33px 40px 0 70px;
	}

	.title {
		font-size: 20px;
		font-weight: 700;
		margin-bottom: 14px;
	}

	.elements {
		overflow-y: auto;

		.element {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			gap: 5px;

			.index {
				width: 28px;
			}

			.element-label-wrap {
				display: flex;
				gap: 5px;
				align-items: center;
				width: 119px;
			}
		}
	}
</style>
