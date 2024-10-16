<script lang="ts">
	import {
		bringForward,
		bringToFront,
		deleteElement,
		sendBackward,
		sendToBack
	} from '$stores/canvas/functions';
	import type { Position } from '$types/canvas';

	export let position: Position;
	export let isOpenContextMenu: boolean;

	const closeContextMenu = () => {
		isOpenContextMenu = false;
	};

	const handleAction = (action: () => void) => {
		action();
		closeContextMenu();
	};
</script>

<div class="context-menu" style="top: {position.y}px; left: {position.x}px;">
	<ul>
		<li><button on:click={() => handleAction(deleteElement)}>삭제</button></li>
		<li><button on:click={() => handleAction(sendToBack)}>맨 뒤로</button></li>
		<li><button on:click={() => handleAction(sendBackward)}>뒤로</button></li>
		<li><button on:click={() => handleAction(bringForward)}>앞으로</button></li>
		<li><button on:click={() => handleAction(bringToFront)}>맨 앞으로</button></li>
	</ul>
</div>

<style lang="scss">
	.context-menu {
		position: fixed;
		z-index: 999;
		width: 200px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 5px 2px;
		padding: 5px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

		ul {
			display: flex;
			flex-direction: column;
		}
		button {
			width: 100%;
			text-align: left;
			padding: 4px 10px;

			&:hover {
				background-color: #f5f5f5;
			}
		}
	}
</style>
