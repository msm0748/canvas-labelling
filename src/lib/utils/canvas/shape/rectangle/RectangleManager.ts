import { get } from 'svelte/store';
import { Rectangle } from './Rectangle';
import BaseShapeManager from '../../base/BaseShapeManager';
import { updateElements } from '$stores/canvas/functions';

export class RectangleManager extends BaseShapeManager {
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

	private cursorForPosition = (position: string) => {
		switch (position) {
			case 'tl':
			case 'br':
				return 'nwse-resize';
			case 'tr':
			case 'bl':
				return 'nesw-resize';
			case 't':
			case 'b':
				return 'row-resize';
			case 'l':
			case 'r':
				return 'col-resize';
			default:
				return 'move';
		}
	};

	private setMouseCursorStyle(offsetX: number, offsetY: number) {
		const selectedTool = get(this.$selectedTool);

		if (selectedTool === 'move') return;
		else if (selectedTool === 'rectangle') {
			this.$mouseCursorStyle.set('crosshair');
			return;
		} else if (selectedTool === 'comment') {
			this.$mouseCursorStyle.set('copy');
			return;
		}

		const selectedElement = get(this.$selectedElement);

		// 마지막에 추가된 Rect부터 선택하기 위해 reverse
		const elements = [...get(this.$elements)].reverse();

		for (const element of elements) {
			const inside = element?.isPointInside(offsetX, offsetY);

			if (selectedElement?.id === element.id) {
				const position = element.positionWithinElement(offsetX, offsetY);

				if (position) {
					const cursor = this.cursorForPosition(position);
					this.$mouseCursorStyle.set(cursor);
					return;
				}
			}

			if (inside) {
				this.$mouseCursorStyle.set('move');

				return;
			}
		}

		this.$mouseCursorStyle.set('default');
	}

	protected override createElement(offsetX: number, offsetY: number) {
		this.$selectedElement.reset();
		const { label, color } = get(this.$selectedClass);
		const element = new Rectangle(label, color);

		element.create(offsetX, offsetY);

		this.$history.setState([...get(this.$elements), element]);
		this.action = 'drawing';
	}

	protected override selectElement(offsetX: number, offsetY: number) {
		// 마지막에 추가된 Rect부터 선택하기 위해 reverse
		const elements = [...get(this.$elements)].reverse();
		const selectedElement = get(this.$selectedElement);

		for (const element of elements) {
			const position = element.positionWithinElement(offsetX, offsetY);
			if (!position) continue;

			// 선택된 Rect만 updating(resizing) 되도록 하고 선택 안된 Rect는 move만 되도록 하는 로직
			if (selectedElement?.id !== element.id) {
				const dragOffsets = element.calculateDragOffsets(offsetX, offsetY, 'inside');

				element.setDragOffsets(dragOffsets.dragOffsetX, dragOffsets.dragOffsetY, 'inside');
				this.$selectedElement.select(element);
				this.action = 'moving';
				return;
			} else {
				const dragOffsets = element.calculateDragOffsets(offsetX, offsetY, position);

				element.setDragOffsets(
					dragOffsets.dragOffsetX,
					dragOffsets.dragOffsetY,
					dragOffsets.position
				);
				this.$selectedElement.select(element);

				this.action = selectedElement.position === 'inside' ? 'moving' : 'updating';

				return;
			}
		}

		this.$selectedElement.reset();
		this.action = 'none';
	}

	public override onLeftMouseDown(offsetX: number, offsetY: number) {
		this.startPos = { x: offsetX, y: offsetY };

		switch (get(this.$selectedTool)) {
			case 'rectangle':
				if (this.action === 'none') {
					this.createElement(offsetX, offsetY);
				}
				break;

			case 'select':
				this.selectElement(offsetX, offsetY);
				break;

			default:
				break;
		}
	}

	public override onRightMouseDown(offsetX: number, offsetY: number) {
		switch (get(this.$selectedTool)) {
			case 'select':
				this.selectElement(offsetX, offsetY);
				this.action = 'none';
				break;

			default:
				break;
		}
	}

	public override onMouseMove(offsetX: number, offsetY: number) {
		const $elements = get(this.$elements);

		this.setMouseCursorStyle(offsetX, offsetY);

		switch (this.action) {
			case 'drawing':
				{
					const element = $elements[$elements.length - 1];
					element.update(offsetX, offsetY);
				}
				break;

			case 'moving':
				{
					const selectedElement = get(this.$selectedElement);
					if (!selectedElement) return;
					selectedElement.move(offsetX, offsetY);
				}
				break;

			case 'updating':
				{
					const selectedElement = get(this.$selectedElement);
					if (!selectedElement) return;

					selectedElement.resizing(offsetX, offsetY);
				}
				break;

			default:
				break;
		}
	}

	public override onMouseUp(offsetX: number, offsetY: number) {
		const $elements = get(this.$elements);

		switch (this.action) {
			case 'drawing':
				{
					const element = $elements[$elements.length - 1];
					const { points } = element;
					const [{ x: sX, y: sY }, { x: cX, y: cY }] = points;

					const { minX, minY, maxX, maxY } = this.clamp(sX, sY, cX, cY);

					element.points[0] = { x: minX, y: minY };
					element.points[1] = { x: maxX, y: maxY };

					if (Math.abs(sX - cX) < 5 || Math.abs(sY - cY) < 5) return;

					updateElements(element, true);
				}
				break;

			case 'moving':
			case 'updating':
				{
					// 이동한 거리가 없으면 history에 안 쌓이게 break;
					const { x: startX, y: startY } = this.startPos;
					if (startX === offsetX && startY === offsetY) break;

					const selectedElement = get(this.$selectedElement);
					if (!selectedElement) return;

					const { points } = selectedElement;
					const [{ x: sX, y: sY }, { x: cX, y: cY }] = points;

					const { minX, minY, maxX, maxY } = this.clamp(sX, sY, cX, cY);

					selectedElement.points[0] = { x: minX, y: minY };
					selectedElement.points[1] = { x: maxX, y: maxY };

					updateElements(selectedElement);
				}
				break;

			default:
				break;
		}
		this.action = 'none';
	}
}
