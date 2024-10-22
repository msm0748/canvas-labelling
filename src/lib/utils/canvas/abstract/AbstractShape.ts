import { canvasStore } from '$stores/canvas';
import type { Point, RectanglePosition } from '$types/Canvas';
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_RESIZE_POINT } from '$lib/constants/canvas';

export default abstract class AbstractShape {
	public id: string;
	public type: string;
	public label: string;
	public color: string;
	public points: Point[];
	public isComplete: boolean;
	public resizePoint = INITIAL_RESIZE_POINT;

	public $selectedElement = canvasStore.selectedElement;
	public $scale = canvasStore.scale; // 전역

	/** 객체의 어느 위치를 수정할지 나타내는 변수 */
	public position: number | RectanglePosition | null = null;
	/** 객체가 드래그 중 자연스럽게 이동하도록 돕는 변수 */
	public dragOffsetX = 0;
	/** 객체가 드래그 중 자연스럽게 이동하도록 돕는 변수 */
	public dragOffsetY = 0;

	constructor(type: 'polygon' | 'rectangle' | 'featurePoint') {
		this.type = type;
		this.id = uuidv4();
		this.points = [];
		this.isComplete = false;
		this.label = '';
		this.color = 'lime';
	}

	public init(label: string, color: string) {
		this.label = label;
		this.color = color;
	}

	abstract create(x: number, y: number): void;
	abstract move(dx: number, dy: number): void;
	abstract draw(ctx: CanvasRenderingContext2D): void;

	// 이게 필요할까???
	public setDragOffsets(
		dragOffsetX: number,
		dragOffsetY: number,
		position: number | RectanglePosition | null
	) {
		this.dragOffsetX = dragOffsetX;
		this.dragOffsetY = dragOffsetY;
		this.position = position;
	}
}
