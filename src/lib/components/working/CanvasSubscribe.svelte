<script lang="ts">
	import { get } from 'svelte/store';
	import _ from 'lodash';
	import { canvasStore } from '$stores/canvas';
	import { onDestroy } from 'svelte';
	import { fetchSmartPolygon } from '$lib/utils/canvas/common/smartPolygon';
	import { Polygon } from '$lib/utils/canvas/polygon/Polygon';
	import { calculateRelativePositionFromAbsolute } from '$lib/utils/canvas/common/mousePositionCalculator';

	const historyUnsubscribe = canvasStore.history.subscribe((state) => {
		canvasStore.elements.set(_.cloneDeep(state.history[state.index]) || []);

		// 선택된 폴리곤 최신상태 유지
		const selectedElement = get(canvasStore.selectedElement);
		if (selectedElement) {
			const newSelectedElement = get(canvasStore.elements).find(
				(element) => element.id === selectedElement.id
			);
			if (newSelectedElement) canvasStore.selectedElement.select(newSelectedElement);
			else canvasStore.selectedElement.unselect();
		}
	});

	const samHistoryUnsubscribe = canvasStore.samHistory.subscribe(async (state) => {
		const samPoints = state.history[state.index];
		const elements: Polygon[] = [];

		if (samPoints.length === 0) return;

		const polygons = await fetchSmartPolygon(samPoints);
		const selectedClass = get(canvasStore.selectedClass);
		polygons.forEach((polygon) => {
			const element = new Polygon();
			element.init(selectedClass.name, selectedClass.color);
			const points = polygon.polygon.map(([x, y]) => {
				const { x: relativeX, y: relativeY } = calculateRelativePositionFromAbsolute(x, y);
				return { x: relativeX, y: relativeY };
			});
			element.points = points;
			element.isComplete = true;
			elements.push(element);
		});
		canvasStore.sam.updateElements(elements);
		canvasStore.sam.updateSamPoints(samPoints);
	});

	onDestroy(() => {
		historyUnsubscribe();
		samHistoryUnsubscribe();
	});
</script>
