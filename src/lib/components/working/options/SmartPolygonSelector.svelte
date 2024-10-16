<script lang="ts">
	import { canvasStore } from '$stores/canvas';

	const reset = () => {
		canvasStore.sam.reset();
	};

	const save = () => {
		canvasStore.sam.save();
	};

	const undo = () => {
		canvasStore.samHistory.undo();
	};

	const redo = () => {
		canvasStore.samHistory.redo();
	};
</script>

<div class="wrap">
	<header>
		<span>Smart Polygon</span>
		<button on:click={reset}>x</button>
	</header>
	<div>
		<button on:click={undo}>undo</button>
		<button on:click={redo}>redo</button>
	</div>
	<div class="btns">
		<button on:click={reset}>delete</button>
		<button on:click={save}>save</button>
	</div>
</div>

<style lang="scss">
	.wrap {
		position: absolute;
		width: 230px;
		left: 20px;
		top: 20px;
		z-index: 999;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
		border-radius: 10px;
		background-color: #ddd;
	}

	header {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		color: #fff;
	}

	.btns {
		display: flex;
		justify-content: space-between;
		padding: 10px;
	}
</style>
