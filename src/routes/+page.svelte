<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
	import KeyboardManager from '$lib/utils/canvas/KeyboardManager';
	import type { Label } from '$types/canvas';
	import { resetCanvasStore } from '$stores/canvas';
	import Canvas from '$lib/components/working/canvas/Canvas.svelte';

	setContext('label', 'rectangle');

	$: imageSrc = 'https://cdn-icons-png.flaticon.com/512/3179/3179575.png';

	let keyboardManager: KeyboardManager;

	onMount(() => {
		keyboardManager = new KeyboardManager('rectangle' as Label);
	});

	onDestroy(() => {
		resetCanvasStore();
		// 컴포넌트가 여러 번 마운트되면서 KeyboardManager의 인스턴스가 계속 생성되어 이벤트가 중복 등록되는 현상 방지
		// keyboardManager.destroy();
	});
</script>

{#if imageSrc}
	<Canvas {imageSrc} brightness={100} contrast={100}></Canvas>
{/if}
