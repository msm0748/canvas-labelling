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
	public isVisible = true;

	public $selectedElement = canvasStore.selectedElement;
	public $scale = canvasStore.scale; // 전역

	/** 객체의 어느 위치를 수정할지 나타내는 변수 */
	public position: number | RectanglePosition | null = null;
	/** 객체가 드래그 중 자연스럽게 이동하도록 돕는 변수 */
	public dragOffsetX = 0;
	/** 객체가 드래그 중 자연스럽게 이동하도록 돕는 변수 */
	public dragOffsetY = 0;

	constructor(type: 'polygon' | 'rectangle' | 'featurePoint', label: string, color: string) {
		if (!type || !label || !color) {
			throw new Error('type, label, color는 필수값입니다.');
		}
		this.type = type;
		this.label = label;
		this.color = color;
		this.id = uuidv4();
		this.points = [];
		this.isComplete = false;
	}

	public abstract create(x: number, y: number): void;
	public abstract move(dx: number, dy: number): void;
	public abstract draw(ctx: CanvasRenderingContext2D): void;

	/** 드래그 작업 중 특정 위치를 기준으로 오프셋을 계산 */
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
