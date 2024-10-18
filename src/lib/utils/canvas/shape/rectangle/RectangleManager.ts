import { get, type Writable } from 'svelte/store';
import { Rectangle } from './Rectangle';
import { canvasStore } from '$stores/canvas';
import AbstractShapeManager from '../../abstract/AbstractShapeManager';

export class RectangleManager extends AbstractShapeManager {
	private elements: Rectangle[] = [];

	constructor(ctx: CanvasRenderingContext2D) {
		super(ctx);
	}

	/**
	 * 그리는 순서에 상관없이 정확한 사각형의 경계값을 계산
	 * ex) 왼쪽에서 오른쪽으로 그리는 경우, 오른쪽에서 왼쪽으로 그리는 경우
	 */
	private clamp(sX: number, sY: number, cX: number, cY: number) {
		const minX = Math.min(sX, cX);
		const minY = Math.min(sY, cY);
		const maxX = Math.max(sX, cX);
		const maxY = Math.max(sY, cY);

		return { minX, minY, maxX, maxY };
	}

	createElement(offsetX: number, offsetY: number) {
		// 마우스 우클릭 시 라벨 생성 방지
		const { name, color } = get(this.$selectedClass);
		const element = new Rectangle();

		element.init(name, color);
		element.create(offsetX, offsetY);

		this.elements.push(element);

		this.action = 'drawing';
	}

	selectElement(offsetX: number, offsetY: number) {}

	onMouseDown(offsetX: number, offsetY: number) {
		switch (get(this.$selectedTool)) {
			case 'rectangle':
				if (this.action === 'none') {
					this.createElement(offsetX, offsetY);
				}
				break;
			default:
				break;
		}
	}

	onMouseMove(offsetX: number, offsetY: number) {
		switch (this.action) {
			case 'drawing':
				{
					const element = this.elements[this.elements.length - 1];
					element.update(offsetX, offsetY);
				}
				break;

			default:
				break;
		}
	}

	onMouseUp(offsetX: number, offsetY: number) {
		switch (this.action) {
			case 'drawing':
				{
					const element = this.elements[this.elements.length - 1];
					const { points } = element;

					const [{ x: sX, y: sY }, { x: cX, y: cY }] = points;

					const { minX, minY, maxX, maxY } = this.clamp(sX, sY, cX, cY);

					element.points[0] = { x: minX, y: minY };
					element.points[1] = { x: maxX, y: maxY };

					if (Math.abs(sX - cX) < 5 || Math.abs(sY - cY) < 5) return;
				}

				break;

			default:
				break;
		}
		this.action = 'none';
	}

	public draw() {
		this.elements.forEach((element) => element.draw(this.ctx));
	}
}
