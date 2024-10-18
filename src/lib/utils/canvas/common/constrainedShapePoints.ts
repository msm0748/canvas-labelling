import { canvasStore } from '$stores/canvas';
import { get } from 'svelte/store';

import type { ImageInfo, Point } from '$types/canvas';

/** 이미지 경계를 벗어나지 않도록 조정된 새로운 좌표를 반환 */
export const adjustOffsetWithinImageBounds = (offsetX: number, offsetY: number) => {
	const imageInfo = get(canvasStore.imageInfo);
	const { x, y, width, height } = imageInfo as ImageInfo;

	const minX = x;
	const minY = y;
	const maxX = x + width;
	const maxY = y + height;

	if (offsetX < minX) {
		offsetX = minX;
	} else if (offsetX > maxX) {
		offsetX = maxX;
	}

	if (offsetY < minY) {
		offsetY = minY;
	} else if (offsetY > maxY) {
		offsetY = maxY;
	}

	return { adjustedOffsetX: offsetX, adjustedOffsetY: offsetY };
};

/**  */
const getShapeBounds = () => {
	const imageInfo = get(canvasStore.imageInfo);

	const { x, y, width, height } = imageInfo as ImageInfo;

	const minX = x;
	const minY = y;
	const maxX = x + width;
	const maxY = y + height;

	return { minX, minY, maxX, maxY };
};

/** 폴리곤의 경계를 계산하는 헬퍼 함수 */
const getPolygonBounds = (points: Point[]) => {
	const xCoords = points.map((p) => p.x);
	const yCoords = points.map((p) => p.y);
	return {
		minX: Math.min(...xCoords),
		minY: Math.min(...yCoords),
		maxX: Math.max(...xCoords),
		maxY: Math.max(...yCoords)
	};
};

/** 다각형 이동 시 이미지 경계를 벗어나지 않도록 조정된 새로운 좌표를 반환 */
export const getConstrainedPolygonPoints = (dx: number, dy: number, points: Point[]) => {
	const { minX, minY, maxX, maxY } = getShapeBounds();

	// 먼저 모든 점을 이동
	let newPoints = points.map(({ x, y }) => ({ x: x + dx, y: y + dy }));

	// 이동된 폴리곤의 경계 계산
	const polygonBounds = getPolygonBounds(newPoints);

	// X 방향 조정
	if (polygonBounds.minX < minX) {
		const adjustment = minX - polygonBounds.minX;
		newPoints = newPoints.map(({ x, y }) => ({ x: x + adjustment, y }));
	} else if (polygonBounds.maxX > maxX) {
		const adjustment = maxX - polygonBounds.maxX;
		newPoints = newPoints.map(({ x, y }) => ({ x: x + adjustment, y }));
	}

	// Y 방향 조정
	if (polygonBounds.minY < minY) {
		const adjustment = minY - polygonBounds.minY;
		newPoints = newPoints.map(({ x, y }) => ({ x, y: y + adjustment }));
	} else if (polygonBounds.maxY > maxY) {
		const adjustment = maxY - polygonBounds.maxY;
		newPoints = newPoints.map(({ x, y }) => ({ x, y: y + adjustment }));
	}

	return newPoints;
};

/** rect 이동 시 이미지 경계를 벗어나지 않도록 조정된 새로운 좌표를 반환 */
export const getConstrainedRectanglePoints = (dx: number, dy: number, points: Point[]) => {
	const { minX, minY, maxX, maxY } = getShapeBounds();

	const x = points[0].x;
	const y = points[0].y;
	const width = points[1].x - points[0].x;
	const height = points[1].y - points[0].y;

	// 새로운 좌표를 계산하고 경계를 벗어나지 않도록 조정
	const newX = Math.min(Math.max(x + dx, minX), maxX - width);
	const newY = Math.min(Math.max(y + dy, minY), maxY - height);

	const newPoints = [
		{ x: newX, y: newY },
		{ x: newX + width, y: newY + height }
	];

	return newPoints;
};
