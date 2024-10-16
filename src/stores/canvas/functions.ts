import { get } from 'svelte/store';
import { canvasStore } from './index';
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

/** 뒤로 보내기 */
export const bringForward = () => {
	const selectedElement = get(canvasStore.selectedElement);
	const elements = get(canvasStore.elements);
	if (selectedElement) {
		const index = elements.indexOf(selectedElement);
		if (index < elements.length - 1) {
			// index가 배열 길이보다 작은 경우에만 진행
			const newElements = [
				...elements.slice(0, index), // 선택된 다각형의 이전 요소들
				elements[index + 1], // 선택된 다각형의 바로 다음 요소
				elements[index], // 선택된 다각형
				...elements.slice(index + 2) // 선택된 다각형의 이후 요소들
			];

			canvasStore.history.setState(newElements);
		}
	}
};

/** 맨 뒤로 보내기 */
export const bringToFront = () => {
	const selectedElement = get(canvasStore.selectedElement);
	const elements = get(canvasStore.elements);
	if (selectedElement) {
		const index = elements.indexOf(selectedElement);
		const newElements = [
			...elements.slice(0, index),
			...elements.slice(index + 1),
			elements[index]
		];

		canvasStore.history.setState(newElements);
	}
};

/** 앞으로 가져오기 */
export const sendBackward = () => {
	const selectedElement = get(canvasStore.selectedElement);
	const elements = get(canvasStore.elements);
	if (selectedElement) {
		const index = elements.indexOf(selectedElement);
		if (index > 0) {
			// index가 0보다 큰 경우에만 진행
			const newElements = [
				...elements.slice(0, index - 1), // 선택된 다각형의 이전 요소들
				elements[index], // 선택된 다각형
				elements[index - 1], // 선택된 다각형의 바로 이전 요소
				...elements.slice(index + 1) // 선택된 다각형의 이후 요소들
			];

			canvasStore.history.setState(newElements);
		}
	}
};

/** 맨 앞으로 가져오기 */
export const sendToBack = () => {
	const selectedElement = get(canvasStore.selectedElement);
	const elements = get(canvasStore.elements);
	if (selectedElement) {
		const index = elements.indexOf(selectedElement);
		const newElements = [
			elements[index], // 선택된 다각형을 맨 앞에 추가
			...elements.slice(0, index),
			...elements.slice(index + 1)
		];

		canvasStore.history.setState(newElements);
	}
};

export const undo = () => {
	const selectedTool = get(canvasStore.selectedTool);
	if (selectedTool === 'smartPolygon') {
		canvasStore.samHistory.undo();
	} else {
		canvasStore.history.undo();
	}
};

export const redo = () => {
	const selectedTool = get(canvasStore.selectedTool);
	if (selectedTool === 'smartPolygon') {
		canvasStore.samHistory.redo();
	} else {
		canvasStore.history.redo();
	}
};

export const zoomOut = () => {
	const viewPos = get(canvasStore.viewPos);
	const scale = get(canvasStore.scale);
	const canvasSize = get(canvasStore.canvasSize);

	// 중앙으로 줌 아웃
	const imageMedianX = viewPos.x + (canvasSize.width * scale) / 2;
	const imageMedianY = viewPos.y + (canvasSize.height * scale) / 2;
	const xs = (imageMedianX - viewPos.x) / scale;
	const ys = (imageMedianY - viewPos.y) / scale;
	canvasStore.scale.setScale('zoomOut');

	const x = imageMedianX - xs * get(canvasStore.scale);
	const y = imageMedianY - ys * get(canvasStore.scale);
	canvasStore.viewPos.set({ x, y });
};

export const zoomIn = () => {
	const viewPos = get(canvasStore.viewPos);
	const scale = get(canvasStore.scale);
	const canvasSize = get(canvasStore.canvasSize);
	// 중앙으로 줌 인
	const imageMedianX = viewPos.x + (canvasSize.width * scale) / 2;
	const imageMedianY = viewPos.y + (canvasSize.height * scale) / 2;
	const xs = (imageMedianX - viewPos.x) / scale;
	const ys = (imageMedianY - viewPos.y) / scale;
	canvasStore.scale.setScale('zoomIn');

	const x = imageMedianX - xs * get(canvasStore.scale);
	const y = imageMedianY - ys * get(canvasStore.scale);
	canvasStore.viewPos.set({ x, y });
};
