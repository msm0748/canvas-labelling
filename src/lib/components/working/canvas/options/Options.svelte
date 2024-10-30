<script lang="ts">
	import FilterControl from './FilterControl.svelte';
	import ScaleControl from './ScaleControl.svelte';
</script>

<div class="wrap">
	<ScaleControl />
	<FilterControl />
</div>

<style lang="scss">
	div {
		display: flex;
		gap: 7px;
	}
</style>
