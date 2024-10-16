import { get } from 'svelte/store';
import Shape from '../AbstractShape';
import type { Point, Position } from '$types/canvas';
import {
	getConstrainedPolygonPoints,
	adjustOffsetWithinImageBounds
} from '../common/constrainedShapePoints';

export class Polygon extends Shape {
	draggingPointIndex: number;

	constructor() {
		super('polygon');
	}

	create(offsetX: number, offsetY: number) {
		const { adjustedOffsetX, adjustedOffsetY } = adjustOffsetWithinImageBounds(offsetX, offsetY);
		const point = { x: adjustedOffsetX, y: adjustedOffsetY, controlPoint: null };

		this.draggingPointIndex = this.points.length;
		this.points.push(point);
	}

	/** 마우스 클릭 시 제어점을 클릭했는지 확인 */
	controlPointClicked(offsetX: number, offsetY: number) {
		for (let i = 1; i < this.points.length; i++) {
			if (this.points[i].controlPoint) {
				const dx = offsetX - this.points[i].controlPoint!.x;
				const dy = offsetY - this.points[i].controlPoint!.y;
				const resizePoint = get(this.resizePoint) / 2;
				if (dx * dx + dy * dy < Math.pow(resizePoint, 2)) {
					return i;
				}
			}
		}
		return false;
	}

	/** 베지어 곡선을 그리기 위해 제어점을 이동하거나 새 제어점을 생성하는 역할 */
	bezierCurveTo(offsetX: number, offsetY: number, isControlPoint: boolean) {
		if (isControlPoint) {
			// 제어점 이동
			this.points[this.draggingPointIndex].controlPoint!.x = offsetX;
			this.points[this.draggingPointIndex].controlPoint!.y = offsetY;
		} else if (this.draggingPointIndex === this.points.length - 1) {
			// 새 제어점 생성
			// 제어점의 위치를 반대로 계산
			const dx = offsetX - this.points[this.draggingPointIndex].x;
			const dy = offsetY - this.points[this.draggingPointIndex].y;
			this.points[this.draggingPointIndex].controlPoint = {
				x: this.points[this.draggingPointIndex].x - dx,
				y: this.points[this.draggingPointIndex].y - dy
			};
		}
	}

	/** 폴리곤 이동 및 수정 시 폴리곤의 위치 계산 */
	calculatePolygonOffset(offsetX: number, offsetY: number, position?: number) {
		const { adjustedOffsetX, adjustedOffsetY } = adjustOffsetWithinImageBounds(
			offsetX - this.dragOffsetX,
			offsetY - this.dragOffsetY
		);

		const dx = adjustedOffsetX - this.points[position ?? 0].x;
		const dy = adjustedOffsetY - this.points[position ?? 0].y;

		return { dx, dy };
	}

	/** 다각형 전체 이동 */
	move(offsetX: number, offsetY: number) {
		const { dx, dy } = this.calculatePolygonOffset(offsetX, offsetY);

		const newPoints = getConstrainedPolygonPoints(dx, dy, this.points);
		this.points = newPoints;
	}

	/** 다각형 꼭짓점 추가 */
	addPoint(offsetX: number, offsetY: number) {
		const { adjustedOffsetX, adjustedOffsetY } = adjustOffsetWithinImageBounds(offsetX, offsetY);
		if (typeof this.position === 'number') {
			const point = { x: adjustedOffsetX, y: adjustedOffsetY };
			this.points.splice(this.position, 0, point);
		}
	}

	/** 다각형 꼭짓점 삭제 */
	removePoint() {
		if (this.points.length < 4) return;
		if (typeof this.position === 'number') this.points.splice(this.position, 1);
	}

	/** 다각형 꼭짓점 위치 수정 */
	updatePoint(offsetX: number, offsetY: number) {
		const position = this.position;

		const { dx, dy } = this.calculatePolygonOffset(offsetX, offsetY, position as number);

		this.points = this.points.map(({ x, y }, index) => {
			if (index !== position) return { x, y };
			const newX = x + dx;
			const newY = y + dy;
			return { x: newX, y: newY };
		});
		return this.points;
	}

	/**
	 * "Ray Casting Algorithm"
	 * 현재 마우스 위치가 다각형 안에 들어있는가를 판별
	 */
	findPointInsidePolygon(offsetX: number, offsetY: number) {
		let inside = false;

		for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
			const xi = this.points[i].x;
			const yi = this.points[i].y;
			const xj = this.points[j].x;
			const yj = this.points[j].y;

			const intersect =
				yi > offsetY !== yj > offsetY && offsetX < ((xj - xi) * (offsetY - yi)) / (yj - yi) + xi;
			if (intersect) {
				inside = !inside;
			}
		}

		if (inside) {
			return {
				dragOffsetX: offsetX - this.points[0].x,
				dragOffsetY: offsetY - this.points[0].y
			};
		}
		return false;
	}

	/**
	 * 마우스가 다각형 "모서리(포인트)"에 있는지 찾는 함수
	 */
	findPointOnVertex(offsetX: number, offsetY: number) {
		const tolerance = get(this.resizePoint);

		for (let i = 0; i < this.points.length; i++) {
			const vertex = this.points[i];
			const dx = offsetX - vertex.x;
			const dy = offsetY - vertex.y;
			if (Math.sqrt(dx * dx + dy * dy) < tolerance) {
				return {
					dragOffsetX: offsetX - vertex.x,
					dragOffsetY: offsetY - vertex.y,
					position: i
				};
			}
		}
		return false;
	}

	isPointOnLine(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		offsetX: number,
		offsetY: number,
		tolerance = 1
	) {
		const distance1 = Math.sqrt((offsetX - x1) ** 2 + (offsetY - y1) ** 2);
		const distance2 = Math.sqrt((offsetX - x2) ** 2 + (offsetY - y2) ** 2);
		const lineDistance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
		return Math.abs(distance1 + distance2 - lineDistance) < tolerance;
	}

	/**
	 * 마우스가 다각형 라인에 있는지 찾는 함수
	 */
	findPointOnBoundary(offsetX: number, offsetY: number) {
		for (let j = 0; j < this.points.length; j++) {
			const nextIndex = (j + 1) % this.points.length;
			const [x1, y1] = [this.points[j].x, this.points[j].y];
			const [x2, y2] = [this.points[nextIndex].x, this.points[nextIndex].y];

			if (this.isPointOnLine(x1, y1, x2, y2, offsetX, offsetY)) {
				return {
					dragOffsetX: 0,
					dragOffsetY: 0,
					position: j + 1
				};
			}
		}

		return false;
	}

	/** 2차 베지어 곡선 보간법 */
	interpolateQuadraticBezier(p0: Point, p1: Point, p2: Point, t: number) {
		const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
		const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
		return { x, y };
	}

	/** 곡선의 휘어진 정도(곡률) 근사 계산 */
	calculateCurvature(start: Point, control: Point, end: Point) {
		// 시작점에서 끝점까지의 직선 거리
		const chord = Math.hypot(end.x - start.x, end.y - start.y);

		// 제어점에서 직선까지의 최대 거리
		const v1x = control.x - start.x;
		const v1y = control.y - start.y;
		const v2x = end.x - start.x;
		const v2y = end.y - start.y;
		const area = Math.abs(v1x * v2y - v1y * v2x) / 2;
		const height = (area * 2) / chord;

		// 곡률을 높이와 현의 비율로 계산
		return height / chord;
	}

	/** 베지어 곡선 분할 */
	quadraticBezierToLines(points: Point[], minSegments = 5, maxSegments = 50) {
		const newPoints = [];
		newPoints.push(points[0]);

		for (let i = 1; i < points.length; i++) {
			const start = points[i - 1];
			const end = points[i];

			if (end.controlPoint) {
				const control = end.controlPoint;
				const curvature = this.calculateCurvature(start, control, end);

				// 곡률에 따라 segments 수 결정
				const segments = Math.min(Math.max(Math.round(curvature * 30), minSegments), maxSegments);

				for (let j = 1; j <= segments; j++) {
					const t = j / segments;
					const point = this.interpolateQuadraticBezier(start, control, end, t);
					newPoints.push(point);
				}
			} else {
				newPoints.push(end);
			}
		}

		return newPoints;
	}

	/**
	 * 다각형 완성 여부 확인
	 * 첫번째 점과 마지막 점이 가까우면 완성된 것으로 판단
	 */
	completePolygon() {
		if (this.points.length < 4) return;

		const firstPointX = this.points[0].x;
		const firstPointY = this.points[0].y;
		const lastPointX = this.points[this.points.length - 1].x;
		const lastPointY = this.points[this.points.length - 1].y;

		if (
			Math.abs(lastPointX - firstPointX) < get(this.resizePoint) &&
			Math.abs(lastPointY - firstPointY) < get(this.resizePoint)
		) {
			const newPoints = this.quadraticBezierToLines(this.points);
			this.points = newPoints;
			this.isComplete = true;
		}
	}

	/** 주어진 점들을 이어 선 그리기 */
	drawConnectingLines(ctx: CanvasRenderingContext2D) {
		ctx.moveTo(this.points[0].x, this.points[0].y);

		for (let i = 1; i < this.points.length; i++) {
			if (this.points[i].controlPoint) {
				ctx.quadraticCurveTo(
					this.points[i].controlPoint!.x,
					this.points[i].controlPoint!.y,
					this.points[i].x,
					this.points[i].y
				);
			} else {
				ctx.lineTo(this.points[i].x, this.points[i].y);
			}
		}
	}

	/** 제어점 및 제어선 그리기 */
	drawControlPointsAndLines(ctx: CanvasRenderingContext2D) {
		if (this.isComplete) return;
		for (let i = 1; i < this.points.length; i++) {
			if (this.points[i].controlPoint) {
				// 제어 선 그리기
				ctx.beginPath();
				ctx.moveTo(this.points[i].x, this.points[i].y);
				ctx.lineTo(this.points[i].controlPoint!.x, this.points[i].controlPoint!.y);
				ctx.strokeStyle = 'black';
				ctx.stroke();
				ctx.closePath();

				// 제어점 그리기
				ctx.beginPath();
				ctx.arc(
					this.points[i].controlPoint!.x,
					this.points[i].controlPoint!.y,
					get(this.resizePoint) / 2,
					0,
					Math.PI * 2
				);
				ctx.fillStyle = 'white';
				ctx.fill();
				ctx.strokeStyle = 'black';
				ctx.stroke();
				ctx.closePath();
			}
		}
	}

	/** 꼭짓점 포인트 사각형을 그리기 */
	drawPointRectangles(ctx: CanvasRenderingContext2D) {
		const selectedElement = get(this.selectedElement);
		if (selectedElement?.id !== this.id && this.isComplete) return;

		ctx.fillStyle = 'white';

		const points = [...this.points].reverse();
		points.forEach((point) => {
			const { x, y } = point;

			ctx.strokeStyle = 'black';

			ctx.strokeRect(
				x - get(this.resizePoint) / 2,
				y - get(this.resizePoint) / 2,
				get(this.resizePoint),
				get(this.resizePoint)
			);

			ctx.fillRect(
				x - get(this.resizePoint) / 2,
				y - get(this.resizePoint) / 2,
				get(this.resizePoint),
				get(this.resizePoint)
			);
		});
	}

	draw(
		ctx: CanvasRenderingContext2D,
		relativeMousePos: Position | null = null,
		isControlPoint: boolean = false
	) {
		if (this.points.length < 1) return;
		this.resizePoint.set(10 / get(this.scale));
		ctx.lineWidth = 2 / get(this.scale);

		ctx.beginPath();
		this.drawConnectingLines(ctx);

		if (this.isComplete) {
			ctx.fillStyle = this.color;
			ctx.closePath();
			if (get(this.applyHoverEffectById) === this.id && get(this.selectedElement)?.id !== this.id) {
				ctx.globalAlpha = 0.3;
				ctx.fill();
			}
			ctx.globalAlpha = 1;
		}

		// 현재 마우스 위치까지 선 그리기
		if (relativeMousePos && !isControlPoint) {
			ctx.lineTo(relativeMousePos.x, relativeMousePos.y);
		}

		ctx.strokeStyle = this.color;

		ctx.stroke();

		this.drawControlPointsAndLines(ctx);

		this.drawPointRectangles(ctx);
	}
}
