import type { Size } from '$types/Canvas';

/**
 * 이미지와 캔버스 크기에 따라 이미지를 조정하여 캔버스에 맞게 배치한 결과를 반환
 */
export const adjustImageToCanvas = (img: HTMLImageElement, canvasSize: Size) => {
	const originalWidth = img.width;
	const originalHeight = img.height;

	// 이미지 원본 가로, 세로 비율 계산
	const imgAspectRatio = originalWidth / originalHeight;
	// 캔버스의 가로, 세로 비율 계산
	const canvasAspectRatio = canvasSize.width / canvasSize.height;

	let width: number, height: number, x: number, y: number;

	if (imgAspectRatio > canvasAspectRatio) {
		// 이미지의 가로가 더 길 경우
		width = canvasSize.width;
		height = (canvasSize.width * img.height) / img.width;
		x = 0;
		y = (canvasSize.height - height) / 2; // 캔버스에 이미지 중앙 정렬
	} else {
		// 이미지의 세로가 더 길 경우
		width = (canvasSize.height * img.width) / img.height;
		height = canvasSize.height;
		x = (canvasSize.width - width) / 2; // 캔버스에 이미지 중앙 정렬
		y = 0;
	}
	return { width, height, x, y };
};
