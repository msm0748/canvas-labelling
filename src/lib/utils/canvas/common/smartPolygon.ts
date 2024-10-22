import { canvasStore } from '$stores/canvas';
import type { SamPoint } from '$types/Canvas';
import { get } from 'svelte/store';

export const fetchSmartPolygon = async (points: SamPoint[]) => {
	const response = await fetch('/api/projects/canvas', {
		method: 'POST',
		body: JSON.stringify({
			imageInfo: get(canvasStore.imageInfo),
			points
		})
	});

	const data = await response.json();

	return data.content.objects;
};
