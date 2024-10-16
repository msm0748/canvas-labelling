<script lang="ts">
	import CommentOffIcon from '$lib/components/icons/CommentOffIcon.svelte';
	import ExitIcon from '$lib/components/icons/ExitIcon.svelte';
	import HandOffIcon from '$lib/components/icons/HandOffIcon.svelte';
	import MenualOffIcon from '$lib/components/icons/MenualOffIcon.svelte';
	import MenualOnIcon from '$lib/components/icons/MenualOnIcon.svelte';
	import PointerOffIcon from '$lib/components/icons/PointerOffIcon.svelte';
	import RedoIcon from '$lib/components/icons/RedoIcon.svelte';
	import SemiAutoOffIcon from '$lib/components/icons/SemiAutoOffIcon.svelte';
	import UndoIcon from '$lib/components/icons/UndoIcon.svelte';
	import type { Tool } from '$types/canvas';
	import { canvasStore } from '$stores/canvas';
	import { redo, undo } from '$stores/canvas/functions';
	import HandOnIcon from '$lib/components/icons/HandOnIcon.svelte';
	import PointerOnIcon from '$lib/components/icons/PointerOnIcon.svelte';
	import CommentOnIcon from '$lib/components/icons/CommentOnIcon.svelte';
	import SemiAutoOnIcon from '$lib/components/icons/SemiAutoOnIcon.svelte';

	export let title: string;
	export let projectId: string;
	export let projectTitle: string;

	const { selectedTool, selectedElement } = canvasStore;

	const onChangeTool = (tool: Tool) => {
		selectedTool.set(tool);
		if (tool === 'rectangle') {
			selectedElement.unselect();
		}
	};
</script>

<header>
	<div class="wrap">
		<ul>
			<li class="header-main">
				<div class="exit-button">
					<button on:click={() => history.back()}><ExitIcon /></button>
				</div>
				<div class="title">
					<span>{title}</span>
				</div>
				<div class="project-info">
					<span>{projectTitle}</span>
				</div>
			</li>
			<li class="header-tools">
				<ul class="tools">
					<li class="group">
						<button on:click={() => onChangeTool('rectangle')}>
							{#if $selectedTool === 'rectangle'}
								<MenualOnIcon />
							{:else}
								<MenualOffIcon />
							{/if}
						</button>
						<button on:click={() => onChangeTool('smartPolygon')}>
							{#if $selectedTool === 'smartPolygon'}
								<SemiAutoOnIcon />
							{:else}
								<SemiAutoOffIcon />
							{/if}
						</button>
					</li>
					<li class="group">
						<button on:click={() => onChangeTool('move')}>
							{#if $selectedTool === 'move'}
								<HandOnIcon />
							{:else}
								<HandOffIcon />
							{/if}
						</button>
						<button on:click={() => onChangeTool('select')}>
							{#if $selectedTool === 'select'}
								<PointerOnIcon />
							{:else}
								<PointerOffIcon />
							{/if}
						</button>
					</li>
					<li class="group">
						<button on:click={undo}><UndoIcon /></button>
						<button on:click={redo}><RedoIcon /></button>
						<button on:click={() => onChangeTool('comment')}>
							{#if $selectedTool === 'comment'}
								<CommentOnIcon />
							{:else}
								<CommentOffIcon />
							{/if}
						</button>
					</li>
				</ul>
			</li>
			<li class="header-content">
				<slot />
			</li>
		</ul>
	</div>
</header>

<style lang="scss">
	header {
		background-color: #131313;
		color: #fff;

		button {
			color: #fff;
		}
	}
	.wrap {
		padding: 17px;
		ul {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.header-main {
				display: flex;
				align-items: center;
				gap: 20px;

				.exit-button {
					margin-right: 7px;

					button {
						display: flex;
					}
				}
				.title {
					font-size: 20px;
					font-weight: 700;
				}
				.project-info {
					font-weight: 500;
				}
			}

			.header-tools {
				.tools {
					display: flex;
					gap: 17px;
					align-items: center;

					.group {
						display: flex;
						gap: 4px;
						position: relative;

						& + .group::before {
							content: '';
							position: absolute;
							top: 50%;
							left: -8px;
							width: 1px;
							height: 20px;
							background-color: #fff;
							transform: translateY(-50%);
						}
					}

					button {
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}
</style>
