import { canvasStore } from '$stores/canvas';
import type { Point, RectanglePosition } from '$types/canvas';
import { v4 as uuidv4 } from 'uuid';

export default abstract class Shape {
	id: string;
	type: string;
	label: string;
	color: string;

	points: Point[];
	isComplete: boolean;

	resizePoint = canvasStore.resizePoint; // 전역
	scale = canvasStore.scale; // 전역

	selectedElement = canvasStore.selectedElement; // 전역
	applyHoverEffectById = canvasStore.applyHoverEffectById; // 전역

	position: number | RectanglePosition | null = null;
	dragOffsetX = 0;
	dragOffsetY = 0;

	constructor(type: 'polygon' | 'rectangle' | 'featurePoint') {
		this.points = [];
		this.id = uuidv4();
		this.type = type;
		this.isComplete = false;
		this.label = '';
		this.color = 'lime';
	}

	init(label: string, color: string) {
		this.label = label;
		this.color = color;
	}

	abstract create(x: number, y: number): void;
	abstract move(dx: number, dy: number): void;

	setDragOffsets(
		dragOffsetX: number,
		dragOffsetY: number,
		position: number | RectanglePosition | null
	) {
		this.dragOffsetX = dragOffsetX;
		this.dragOffsetY = dragOffsetY;
		this.position = position;
	}

	abstract draw(ctx: CanvasRenderingContext2D): void;
}
