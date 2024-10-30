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

export const undo = () => {
	canvasStore.history.undo();
};

export const redo = () => {
	canvasStore.history.redo();
};

/** element 뒤로 보내기 */
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

/** element 맨 뒤로 보내기 */
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

/** element 앞으로 가져오기 */
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

/** element 맨 앞으로 가져오기 */
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

export const handleScaleChange = (newScale: number) => {
	const oldScale = get(canvasStore.scale);
	const viewPos = get(canvasStore.viewPos);
	const canvasSize = get(canvasStore.canvasSize);

	// 캔버스 중심점 계산
	const centerX = canvasSize.width / 2;
	const centerY = canvasSize.height / 2;

	// 현재 뷰포트 상의 중심점에서 실제 컨텐츠 상의 위치 계산
	const pointX = (centerX - viewPos.x) / oldScale;
	const pointY = (centerY - viewPos.y) / oldScale;

	// 새로운 스케일로 변환된 위치 계산
	const newX = centerX - pointX * newScale;
	const newY = centerY - pointY * newScale;

	// 새로운 스케일과 위치 적용
	canvasStore.scale.set(newScale);
	canvasStore.viewPos.set({ x: newX, y: newY });
};

export const zoom = (direction: 'in' | 'out') => {
	const viewPos = get(canvasStore.viewPos);
	const scale = get(canvasStore.scale);
	const canvasSize = get(canvasStore.canvasSize);

	// 중앙 좌표 계산
	const imageMedianX = viewPos.x + (canvasSize.width * scale) / 2;
	const imageMedianY = viewPos.y + (canvasSize.height * scale) / 2;
	const xs = (imageMedianX - viewPos.x) / scale;
	const ys = (imageMedianY - viewPos.y) / scale;

	// 확대/축소 조정
	if (direction === 'in') {
		canvasStore.scale.zoomIn();
	} else {
		canvasStore.scale.zoomOut();
	}

	// 새로운 scale에 맞춰 viewPos 보정
	const newScale = get(canvasStore.scale);
	const x = imageMedianX - xs * newScale;
	const y = imageMedianY - ys * newScale;
	canvasStore.viewPos.set({ x, y });
};
