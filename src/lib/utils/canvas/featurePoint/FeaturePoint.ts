import { get } from 'svelte/store';
import Shape from '../AbstractShape';
import { adjustOffsetWithinImageBounds } from '../common/constrainedShapePoints';

export class FeaturePoint extends Shape {
	radius: number;

	constructor() {
		super('featurePoint');
		this.isComplete = true;
		this.radius = 0;
	}

	create(offsetX: number, offsetY: number) {
		const { adjustedOffsetX, adjustedOffsetY } = adjustOffsetWithinImageBounds(offsetX, offsetY);
		this.points = [{ x: adjustedOffsetX, y: adjustedOffsetY }];
	}

	update(offsetX: number, offsetY: number) {
		const { adjustedOffsetX, adjustedOffsetY } = adjustOffsetWithinImageBounds(offsetX, offsetY);
		this.points = [{ x: adjustedOffsetX, y: adjustedOffsetY }];
	}

	isMouseInCircle(offsetX: number, offsetY: number) {
		const { x, y } = this.points[0];
		const dx = offsetX - x;
		const dy = offsetY - y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		return distance <= this.radius;
	}

	calculateDragOffsets(offsetX: number, offsetY: number) {
		return {
			dragOffsetX: offsetX - this.points[0].x,
			dragOffsetY: offsetY - this.points[0].y
		};
	}

	/** 사각형 전체 이동 */
	move(offsetX: number, offsetY: number) {
		const { adjustedOffsetX, adjustedOffsetY } = adjustOffsetWithinImageBounds(
			offsetX - this.dragOffsetX,
			offsetY - this.dragOffsetY
		);

		this.points = [{ x: adjustedOffsetX, y: adjustedOffsetY }];
	}

	drawText(ctx: CanvasRenderingContext2D) {
		let { x, y } = this.points[0];

		y = y - 12;

		const fontSize = 12;
		const textWidth = ctx.measureText(this.label).width;
		const textHeight = fontSize;
		const padding = 6;

		const backgroundColor = 'rgba(0, 0, 0, 0.3)'; // 배경 색상

		// 배경 사각형을 그립니다.
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(
			x - textWidth / 2 - padding,
			y - padding - textHeight / 2,
			textWidth + padding * 2,
			textHeight / 2 + padding * 2
		);

		ctx.font = '12px serif';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText(this.label, x, y);
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.resizePoint.set(10 / get(this.scale));
		ctx.lineWidth = 2 / get(this.scale) + 1;
		this.radius = ctx.lineWidth;

		const { x, y } = this.points[0];

		this.drawText(ctx);

		ctx.strokeStyle = this.color;
		ctx.fillStyle = this.color;

		ctx.beginPath();
		ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();

		if (get(this.applyHoverEffectById) === this.id && get(this.selectedElement)?.id !== this.id) {
			ctx.beginPath();
			ctx.arc(x, y, this.radius + 1, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	}
}
