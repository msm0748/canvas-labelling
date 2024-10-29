import { get } from 'svelte/store';
import { canvasStore } from '.';
import type { Shape } from '$types/Canvas';

export const deleteElement = () => {
	const selectedElement = get(canvasStore.selectedElement);
	if (selectedElement) {
		const newElements = get(canvasStore.elements).filter(
			(element) => element.id !== selectedElement.id
		);
		canvasStore.history.setState(newElements);
	}
};

export const updateElements = (newElement: Shape, overwrite = false) => {
	const elements = get(canvasStore.elements);
	const newElements = elements.map((element) =>
		element.id === newElement.id ? newElement : element
	);
	canvasStore.history.setState(newElements, overwrite);
};
