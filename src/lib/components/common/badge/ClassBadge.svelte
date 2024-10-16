<script lang="ts">
	import ColorMark from '../mark/ColorMark.svelte';

	export let label = '';
	export let color = '';
	export let hasBackground = true;
</script>

<div class="wrap" class:bg={hasBackground}>
	<div class="badge">
		<ColorMark {color} />
		<span class="text">{label}</span>
	</div>
</div>

<style lang="scss">
	.wrap {
		display: inline-block;
		padding: 2px 8px;

		&.bg {
			background-color: #ddd;
		}
		border-radius: 3px;

		.badge {
			display: flex;
			gap: 5px;
			align-items: center;
		}

		.text {
			font-weight: 500;
		}
	}
</style>
