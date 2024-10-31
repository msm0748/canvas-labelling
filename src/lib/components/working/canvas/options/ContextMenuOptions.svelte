<script lang="ts">
	import {
		bringForward,
		bringToFront,
		deleteElement,
		sendBackward,
		sendToBack
	} from '$stores/canvas/functions';
	import type { Position } from '$types/Canvas';

	export let position: Position;
	export let isOpenContextMenu: boolean;

	let contextMenu: HTMLDivElement;

	const closeContextMenu = () => {
		isOpenContextMenu = false;
	};

	const handleAction = (action: () => void) => {
		action();
		closeContextMenu();
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions (because of reasons) -->
<div
	class="context-menu"
	style="top: {position.y}px; left: {position.x}px;"
	on:contextmenu|preventDefault
	bind:this={contextMenu}
>
	<ul>
		<li><button on:click={() => handleAction(deleteElement)}>삭제</button></li>
		<li><button on:click={() => handleAction(sendToBack)}>맨 뒤로</button></li>
		<li><button on:click={() => handleAction(sendBackward)}>뒤로</button></li>
		<li><button on:click={() => handleAction(bringForward)}>앞으로</button></li>
		<li><button on:click={() => handleAction(bringToFront)}>맨 앞으로</button></li>
	</ul>
</div>

<svelte:window
	on:click={(e) => {
		if (e.target !== contextMenu) closeContextMenu();
	}}
/>

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
