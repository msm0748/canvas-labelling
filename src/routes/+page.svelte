<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
	import Canvas from '$lib/components/working/canvas/Canvas.svelte';

	setContext('label', 'rectangle');

	const imageSrc = '/test.png';
</script>

<Canvas {imageSrc} brightness={100} contrast={100}></Canvas>
