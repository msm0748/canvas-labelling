<script lang="ts">
	import { canvasStore } from '$stores/canvas';
	import {
		MAX_BRIGHTNESS,
		MAX_CONTRAST,
		MIN_BRIGHTNESS,
		MIN_CONTRAST
	} from '$lib/constants/canvas';

	const { brightness, contrast } = canvasStore;
</script>

<div class="wrap">
	<div class="dropdown-content">
		<ul>
			<li>
				<div class="control">
					<div class="label">
						<span>명도</span>
						<span>{$brightness}</span>
					</div>
					<div>
						<button on:click={brightness.reset}>리셋</button>
					</div>
				</div>
				<div class="brightness-slider">
					<input
						type="range"
						min={MIN_BRIGHTNESS}
						max={MAX_BRIGHTNESS}
						step={10}
						bind:value={$brightness}
					/>
				</div>
			</li>
			<li>
				<div class="control">
					<div class="label">
						<span>대비</span>
						<span>{$contrast}</span>
					</div>
					<div>
						<button on:click={contrast.reset}>리셋</button>
					</div>
				</div>
				<div>
					<input
						type="range"
						min={MIN_CONTRAST}
						max={MAX_CONTRAST}
						step={10}
						bind:value={$contrast}
					/>
				</div>
			</li>
		</ul>
	</div>
</div>

<style lang="scss">
	.wrap {
		position: relative;

		.dropdown-content {
			padding: 20px 16px 18px;
			background-color: #333;
			border-radius: 3px;
			width: 272px;

			ul {
				display: flex;
				flex-direction: column;
				gap: 18px;

				li {
					color: #ddd;
					font-size: 14px;
					font-weight: 600;

					.control {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 5px;
					}
				}
			}
		}
	}
</style>
