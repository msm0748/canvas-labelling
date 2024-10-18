import { get } from 'svelte/store';
import type { RectanglePosition } from '$types/canvas';
import Shape from '../../abstract/AbstractShape';
import {
	adjustOffsetWithinImageBounds,
	getConstrainedRectanglePoints
} from '../../common/constrainedShapePoints';

export class Rectangle extends Shape {
	constructor() {
		super('rectangle');
		this.isComplete = true;
	}

	public create(offsetX: number, offsetY: number) {
		const { adjustedOffsetX, adjustedOffsetY } = adjustOffsetWithinImageBounds(offsetX, offsetY);
		this.points = [
			{ x: adjustedOffsetX, y: adjustedOffsetY },
			{ x: adjustedOffsetX, y: adjustedOffsetY }
		];
	}

	/** Rectangle 생성할 때 업데이트 해주는 함수 */
	public updateCornerPoint(cX: number, cY: number) {
		const { adjustedOffsetX, adjustedOffsetY } = adjustOffsetWithinImageBounds(cX, cY);
		this.points[1] = { x: adjustedOffsetX, y: adjustedOffsetY };
	}

	/** 드래그 작업 중 특정 위치를 기준으로 오프셋을 계산 */
	public calculateDragOffsets(offsetX: number, offsetY: number, position: RectanglePosition) {
		const { x: sX, y: sY } = this.points[0];
		const { x: cX, y: cY } = this.points[1];

		const offsetMappings = {
			l: [offsetX - sX, offsetY - sY],
			t: [offsetX - sX, offsetY - sY],
			tl: [offsetX - sX, offsetY - sY],
			inside: [offsetX - sX, offsetY - sY],
			tr: [offsetX - cX, offsetY - sY],
			r: [offsetX - cX, offsetY - sY],
			br: [offsetX - cX, offsetY - cY],
			b: [offsetX - cX, offsetY - cY],
			bl: [offsetX - sX, offsetY - cY]
		};

		const [dragOffsetX, dragOffsetY] = offsetMappings[position] || [0, 0];
		return { dragOffsetX, dragOffsetY, position };
	}

	public resizing(offsetX: number, offsetY: number) {
		const [{ x: sX, y: sY }, { x: cX, y: cY }] = this.points;

		const { adjustedOffsetX: dx, adjustedOffsetY: dy } = adjustOffsetWithinImageBounds(
			offsetX - this.dragOffsetX,
			offsetY - this.dragOffsetY
		);

		if (this.position === 'inside' || this.position === null || typeof this.position === 'number')
			return;

		const resizeMappings = {
			tl: [
				{ x: dx, y: dy },
				{ x: cX, y: cY }
			],
			tr: [
				{ x: sX, y: dy },
				{ x: dx, y: cY }
			],
			br: [
				{ x: sX, y: sY },
				{ x: dx, y: dy }
			],
			bl: [
				{ x: dx, y: sY },
				{ x: cX, y: dy }
			],
			b: [
				{ x: sX, y: sY },
				{ x: cX, y: dy }
			],
			t: [
				{ x: sX, y: dy },
				{ x: cX, y: cY }
			],
			r: [
				{ x: sX, y: sY },
				{ x: dx, y: cY }
			],
			l: [
				{ x: dx, y: sY },
				{ x: cX, y: cY }
			]
		};

		this.points = resizeMappings[this.position] ?? this.points;
	}

	/** 사각형 전체 이동 */
	public move(offsetX: number, offsetY: number) {
		const dx = offsetX - this.dragOffsetX - this.points[0].x;
		const dy = offsetY - this.dragOffsetY - this.points[0].y;

		const newPoints = getConstrainedRectanglePoints(dx, dy, this.points);

		this.points = newPoints;
	}

	/** 주어진 오프셋 좌표가 특정 포인트에 가까운지 확인 */
	private nearPoint(
		offsetX: number,
		offsetY: number,
		x: number,
		y: number,
		name: RectanglePosition,
		cX?: number,
		cY?: number
	) {
		const resizePoint = this.resizePoint;

		if (cX && cY) {
			switch (name) {
				case 't':
				case 'b':
					return x < offsetX && cX > offsetX && Math.abs(offsetY - y) < resizePoint ? name : null;
				case 'l':
				case 'r':
					return y < offsetY && cY > offsetY && Math.abs(offsetX - x) < resizePoint ? name : null;
			}
		} else {
			return Math.abs(offsetX - x) < resizePoint && Math.abs(offsetY - y) < resizePoint
				? name
				: null;
		}

		return null;
	}

	public isPointInside(offsetX: number, offsetY: number) {
		const { x: sX, y: sY } = this.points[0];
		const { x: cX, y: cY } = this.points[1];
		const width = cX - sX;
		const height = cY - sY;
		return offsetX >= sX && offsetX <= sX + width && offsetY >= sY && offsetY <= sY + height;
	}

	/** 주어진 오프셋 좌표를 기준으로 요소 내의 위치를 결정 */
	public positionWithinElement(offsetX: number, offsetY: number) {
		const [{ x: sX, y: sY }, { x: cX, y: cY }] = this.points;

		const checkCornerPoints = () => {
			return (
				this.nearPoint(offsetX, offsetY, sX, sY, 'tl') ||
				this.nearPoint(offsetX, offsetY, cX, sY, 'tr') ||
				this.nearPoint(offsetX, offsetY, sX, cY, 'bl') ||
				this.nearPoint(offsetX, offsetY, cX, cY, 'br')
			);
		};

		const checkEdgePoints = () => {
			return (
				this.nearPoint(offsetX, offsetY, sX, sY, 't', cX, cY) ||
				this.nearPoint(offsetX, offsetY, sX, cY, 'b', cX, cY) ||
				this.nearPoint(offsetX, offsetY, cX, sY, 'r', cX, cY) ||
				this.nearPoint(offsetX, offsetY, sX, sY, 'l', cX, cY)
			);
		};

		const checkInside = () => {
			return this.isPointInside(offsetX, offsetY) ? 'inside' : null;
		};

		const position = checkCornerPoints() || checkEdgePoints() || checkInside();

		return position;
	}

	/** 꼭짓점 포인트 사각형을 그리기 */
	public drawPointRectangles(ctx: CanvasRenderingContext2D) {
		const selectedElement = get(this.selectedElement);
		if (selectedElement?.id !== this.id) return;

		const resizePoint = this.resizePoint;

		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'white';
		const [{ x: sX, y: sY }, { x: cX, y: cY }] = this.points;

		const points = [
			[sX, sY],
			[sX, cY],
			[cX, cY],
			[cX, sY]
		];

		points.forEach(([x, y]) => {
			ctx.strokeRect(x - resizePoint / 2, y - resizePoint / 2, resizePoint, resizePoint);
			ctx.fillRect(x - resizePoint / 2, y - resizePoint / 2, resizePoint, resizePoint);
		});
	}

	public draw(ctx: CanvasRenderingContext2D) {
		this.resizePoint = 10 / get(this.scale);
		ctx.lineWidth = 2 / get(this.scale);

		const { x: sX, y: sY } = this.points[0];
		const { x: cX, y: cY } = this.points[1];
		const width = cX - sX;
		const height = cY - sY;
		ctx.strokeStyle = this.color;
		ctx.strokeRect(sX, sY, width, height);

		if (get(this.applyHoverEffectById) === this.id && get(this.selectedElement)?.id !== this.id) {
			ctx.fillStyle = this.color;
			ctx.globalAlpha = 0.3;
			ctx.fillRect(sX, sY, width, height);
		}
		ctx.globalAlpha = 1;

		this.drawPointRectangles(ctx);
	}
}
