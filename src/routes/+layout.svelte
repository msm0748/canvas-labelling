<script lang="ts">
	import '$styles/main.scss';
	import Header from '$lib/components/working/Header.svelte';
	import Sidebar from '$lib/components/working/sidebar/Sidebar.svelte';
	import { setContext } from 'svelte';

	const classes = [
		{
			id: 7,
			projectId: 'cm22ptfx60001atwdwns4l58c',
			name: '클래스1',
			color: '#2ca02c',
			createdAt: '2024-10-10T03:04:31.220Z',
			updatedAt: '2024-10-10T03:04:31.220Z'
		},
		{
			id: 8,
			projectId: 'cm22ptfx60001atwdwns4l58c',
			name: '클래스2',
			color: '#1f77b4',
			createdAt: '2024-10-10T03:04:31.220Z',
			updatedAt: '2024-10-10T03:04:31.220Z'
		},
		{
			id: 9,
			projectId: 'cm22ptfx60001atwdwns4l58c',
			name: '클래스3',
			color: '#ff7f0e',
			createdAt: '2024-10-10T03:04:31.220Z',
			updatedAt: '2024-10-10T03:04:31.220Z'
		}
	];

	setContext('classes', classes);
</script>

<div class="app">
	<Header />
	<main>
		<div class="wrap">
			<Sidebar />
			<div class="container">
				<slot />
			</div>
		</div>
	</main>
</div>

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		width: 100dvw;
		height: 100dvh;
	}
	main {
		flex: 1;
	}
	.wrap {
		display: flex;
		height: 100%;

		.container {
			flex: 1;
		}
	}
</style>
