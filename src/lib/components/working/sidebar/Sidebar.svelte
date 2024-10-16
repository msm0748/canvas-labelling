<script lang="ts">
	import Classes from './Classes.svelte';
	import Labels from './Labels.svelte';
</script>

<aside>
	<div class="classes-container">
		<Classes />
	</div>
	<div class="label-container">
		<Labels />
	</div>
</aside>

<style lang="scss">
	aside {
		width: 309px;
		height: 100%;
		background-color: #fff;
		border-right: 1px solid #e5e6ed;
		display: flex;
		flex-direction: column;

		.classes-container {
			padding: 30px 40px 0 70px;
			border-bottom: 1px solid #e5e6ed;
		}

		.label-container {
			padding: 20px 40px 30px 70px;
			flex: 1;
		}
	}
</style>
