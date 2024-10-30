<script lang="ts">
	import { MAX_SCALE, MIN_SCALE } from '$lib/constants/canvas';
	import { canvasStore } from '$stores/canvas';
	import { handleScaleChange, zoom } from '$stores/canvas/functions';

	const { scale, viewPos } = canvasStore;

	const reset = () => {
		scale.reset();
		viewPos.reset();
	};

	const onInputScale = (e: Event) => {
		const target = e.target as HTMLInputElement;

		handleScaleChange(Number(target.value));
	};
</script>

<div class="wrap">
	<div class="control-wrap">
		<div class="range-wrap">
			<div class="icon">
				<button on:click={() => zoom('out')}>-</button>
			</div>
			<div class="range-input">
				<input
					type="range"
					min={MIN_SCALE}
					max={MAX_SCALE}
					step={0.1}
					value={$scale}
					on:input={onInputScale}
				/>
			</div>
			<div class="icon">
				<button on:click={() => zoom('in')}>+</button>
			</div>
		</div>

		<span class="percent">{Math.round($scale * 100)}%</span>

		<button type="button" class="reset-btn" on:click={reset}> 리셋 </button>
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		gap: 6px;
		padding: 14px;
		border-radius: 3px;
		background-color: #333;
		box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
	}

	.control-wrap {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	.range-wrap {
		display: flex;
		align-items: center;
		gap: 5px;

		.range-input {
			width: 122px;
			display: flex;
			align-items: center;
		}

		button {
			width: 10px;
			height: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.reset-btn {
		width: 17px;
		height: 17px;
	}

	.percent {
		color: #ddd;
		font-size: 14px;
		font-weight: 500;
	}
</style>
