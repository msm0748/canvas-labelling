<script lang="ts">
	import { canvasStore } from '$stores/canvas';

	const { selectedTool } = canvasStore;

	// canvasStore
</script>

<ul>
	<li><button on:click={() => selectedTool.select('rectangle')}>그리기</button></li>
	<li><button on:click={() => selectedTool.select('move')}>이동</button></li>
	<li><button on:click={() => selectedTool.select('select')}>선택</button></li>
	<li><button>뒤로 가기</button></li>
	<li><button>앞으로 가기</button></li>
	<li><button>코멘트</button></li>
</ul>

<style lang="scss">
	ul {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;

		button {
			color: #fff;
		}
	}
</style>
