<script lang="ts">
	import DisplayIcon from '$lib/components/ui/common/icons/DisplayIcon.svelte';
	import UndoIcon from '$lib/components/ui/common/icons/UndoIcon.svelte';

	export let brightness: number;
	export let contrast: number;

	let displayWidget: HTMLDivElement;
	let isOpen = false;

	const toggle = () => {
		isOpen = !isOpen;
	};

	const resetDisplay = () => {
		brightness = 100;
		contrast = 100;
	};

	const closePanel = (event: MouseEvent) => {
		if (event.target !== displayWidget) {
			isOpen = false;
		}
	};
</script>

<svelte:document on:click={closePanel} />

<div class="wrap">
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions (because of reasons) -->
	<div
		class="display-mode-widget"
		role="button"
		tabindex="0"
		bind:this={displayWidget}
		on:click|stopPropagation
	>
		<button on:click={toggle} class="display-btn">
			<DisplayIcon />
		</button>
		{#if isOpen}
			<div class="display-mode-option-panel">
				<div class="title">
					<div>Display Options</div>
					<button on:click={resetDisplay}>
						<UndoIcon />
					</button>
				</div>
				<div>
					<div>Contrast</div>
					<input type="range" min={0} max={500} bind:value={contrast} />
				</div>
				<div>
					<div>Brightness</div>
					<input type="range" min={0} max={500} bind:value={brightness} />
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.display-mode-widget {
		display: flex;
		gap: 10px;
		align-items: end;
	}

	.display-btn {
		background-color: #f5f5f5;
		border-radius: 50%;
		padding: 8px;
	}

	.display-mode-option-panel {
		background-color: #f5f5f5;
		border-radius: 10px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		width: 280px;

		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		input {
			width: 100%;
		}
	}
</style>
