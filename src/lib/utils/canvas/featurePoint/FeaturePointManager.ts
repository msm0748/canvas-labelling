import { get, type Writable } from 'svelte/store';
import { FeaturePoint } from './FeaturePoint';
import { canvasStore } from '$stores/canvas';
import { updateElements } from '$stores/canvas/functions';
import AbstractShapeManager from '../AbstractShapeManager';

export class FeaturePointManager extends AbstractShapeManager {
	elements = canvasStore.elements as Writable<FeaturePoint[]>; // 전역

	constructor(ctx: CanvasRenderingContext2D) {
		super(ctx);
	}

	private setMouseCursorStyle(offsetX: number, offsetY: number) {
		const selectedTool = get(this.selectedTool);

		if (selectedTool === 'move') return;
		else if (selectedTool === 'featurePoint') {
			this.mouseCursorStyle.set('crosshair');
			return;
		} else if (selectedTool === 'comment') {
			this.mouseCursorStyle.set('copy');
			return;
		}

		// 마지막에 추가된 Rect부터 선택하기 위해 reverse
		const elements = [...get(this.elements)].reverse();

		for (const element of elements) {
			const inside = element.isMouseInCircle(offsetX, offsetY);

			if (inside) {
				this.mouseCursorStyle.set('pointer');
				this.applyHoverEffectById.set(element.id);
				return;
			}
		}

		this.mouseCursorStyle.set('default');
		this.applyHoverEffectById.set(null);
	}

	protected createElement(offsetX: number, offsetY: number, isContextMenu: boolean) {
		// 마우스 우클릭 시 라벨 생성 방지
		if (isContextMenu) return;

		this.selectedElement.unselect();
		const { name, color } = get(this.selectedClass);
		const element = new FeaturePoint();
		element.init(name, color);
		element.create(offsetX, offsetY);
		this.history.setState([...get(this.elements), element]);
		this.action.set('drawing');
	}

	protected selectElement(offsetX: number, offsetY: number, isContextMenu: boolean) {
		const elements = [...get(this.elements)].reverse();

		for (const element of elements) {
			const inside = element.isMouseInCircle(offsetX, offsetY);

			if (inside) {
				const dragOffsets = element.calculateDragOffsets(offsetX, offsetY);
				element.setDragOffsets(dragOffsets.dragOffsetX, dragOffsets.dragOffsetY, null);
				this.selectedElement.select(element);
				// 마우스 우클릭 시 라벨 수정 방지
				if (!isContextMenu) {
					this.action.set('moving');
				}
				return;
			}
		}

		this.selectedElement.unselect();
	}

	handleMouseDown = (offsetX: number, offsetY: number, isContextMenu: boolean) => {
		const selectedTool = get(this.selectedTool);
		const action = get(this.action);

		switch (selectedTool) {
			case 'featurePoint':
				if (action === 'none') {
					this.createElement(offsetX, offsetY, isContextMenu);
				}
				break;

			case 'select':
				this.selectElement(offsetX, offsetY, isContextMenu);
				break;
		}
	};

	handleMouseMove = (offsetX: number, offsetY: number) => {
		const action = get(this.action);
		this.setMouseCursorStyle(offsetX, offsetY);

		switch (action) {
			case 'drawing':
				{
					const element = get(this.elements)[get(this.elements).length - 1];
					element.update(offsetX, offsetY);
				}
				break;

			case 'moving':
				{
					const selectedElement = get(this.selectedElement);
					if (!selectedElement) return;
					selectedElement.move(offsetX, offsetY);
				}
				break;
			default:
				break;
		}
	};

	handleMouseUp = () => {
		const selectedTool = get(this.selectedTool);
		if (selectedTool === 'move') return;

		const action = get(this.action);

		switch (action) {
			case 'drawing':
				{
					const element = get(this.elements)[get(this.elements).length - 1];

					updateElements(element, true);
				}

				break;

			case 'moving':
				{
					const selectedElement = get(this.selectedElement);
					if (!selectedElement) return;

					updateElements(selectedElement);
				}
				break;

			default:
				break;
		}

		this.action.set('none');
	};

	draw() {
		get(this.elements).forEach((element) => element.draw(this.ctx));
	}
}
