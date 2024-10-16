import { canvasStore } from '$stores/canvas';
import type { ImageInfo } from '$types/canvas';
import { get } from 'svelte/store';

/**
 * 현재 좌표를 상대좌표로 변환하기 위한 함수
 */
export const relativeMousePos = (offsetX: number, offsetY: number) => {
	const scale = get(canvasStore.scale);
	const viewPos = get(canvasStore.viewPos);

	const relativePosX = (offsetX - viewPos.x) / scale;
	const relativePosY = (offsetY - viewPos.y) / scale;

	return { x: relativePosX, y: relativePosY };
};

/**
 * 상대좌표를 가지고 절대 좌표를 계산합니다.
 * 딥러닝에게 절대 좌표를 알려주기 위함.
 */
export const calculateAbsolutePositionFromRelative = (relativeX: number, relativeY: number) => {
	const imageInfo = get(canvasStore.imageInfo) as ImageInfo;

	const absolutePosX = (imageInfo.originalWidth / imageInfo.width) * (relativeX - imageInfo.x);
	const absolutePosY = (imageInfo.originalHeight / imageInfo.height) * (relativeY - imageInfo.y);

	return { x: absolutePosX, y: absolutePosY };
};

/**
 * 절대 좌표를 이용하여 상대 좌표를 계산합니다.
 * 딥러닝에서 가져온 데이터 절대 좌표를 상대좌표로 바꿔주기 위함
 */
export const calculateRelativePositionFromAbsolute = (
	absolutePosX: number,
	absolutePosY: number
) => {
	const imageInfo = get(canvasStore.imageInfo) as ImageInfo;

	const relativePosX = absolutePosX / (imageInfo.originalWidth / imageInfo.width) + imageInfo.x;
	const relativePosY = absolutePosY / (imageInfo.originalHeight / imageInfo.height) + imageInfo.y;

	return { x: relativePosX, y: relativePosY };
};
