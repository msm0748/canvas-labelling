<script lang="ts">
	import { INITIAL_POSITION } from '$lib/constants/canvas';
	import { canvasStore } from '$stores/canvas';
	import { zoomIn, zoomOut } from '$stores/canvas/functions';

	const { scale, viewPos } = canvasStore;

	const reset = () => {
		scale.reset();
		viewPos.set(INITIAL_POSITION);
	};
</script>

<div class="wrap">
	<button class="zoom-btn" on:click={zoomOut}>-</button>
	<div class="scale">{Math.round($scale * 100)}%</div>
	<button class="zoom-btn" on:click={zoomIn}>+</button>
	<button class="reset" on:click={reset}>RESET</button>
</div>

<style lang="scss">
	.wrap {
		padding: 10px 15px;
		border-radius: 999px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 15px;
		background-color: #f5f5f5;
		height: 40px;

		.scale {
			width: 35px;
		}
		button {
			padding: 1px;
			border-radius: 50%;

			&.zoom-btn {
				width: 24px;
				height: 24px;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #fff;
				border: 1px solid #e5e5e5;
				transition: background-color 0.2s;
			}

			&.reset {
				padding: 4px 8px;
				border-radius: 8px;
				background-color: #fff;
				border: 1px solid #e5e5e5;
				transition: background-color 0.2s;
			}

			&:hover {
				background-color: #e5e5e5;
			}
		}
	}
</style>
