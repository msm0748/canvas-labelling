<script lang="ts">
	import { canvasStore } from '$stores/canvas';

	const { selectedTool } = canvasStore;

	// canvasStore
</script>

<ul>
	<li>
		<button
			on:click={() => selectedTool.select('rectangle')}
			class:active={$selectedTool === 'rectangle'}>그리기</button
		>
	</li>
	<li>
		<button on:click={() => selectedTool.select('move')} class:active={$selectedTool === 'move'}
			>이동</button
		>
	</li>
	<li>
		<button on:click={() => selectedTool.select('select')} class:active={$selectedTool === 'select'}
			>선택</button
		>
	</li>
	<li><button>뒤로 가기</button></li>
	<li><button>앞으로 가기</button></li>
	<li><button class:active={$selectedTool === 'comment'}>코멘트</button></li>
</ul>

<style lang="scss">
	ul {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;

		button {
			color: #fff;
			padding: 5px;
			border-radius: 3px;

			&.active {
				background-color: #ddd;
				color: #000;
			}
		}
	}
</style>
