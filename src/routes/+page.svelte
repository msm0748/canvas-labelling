<script lang="ts">
	import { setContext } from 'svelte';
	import Canvas from '$lib/components/working/canvas/Canvas.svelte';

	setContext('label', 'rectangle');

	const imageSrc = '/test.webp';
</script>

<Canvas {imageSrc}></Canvas>
