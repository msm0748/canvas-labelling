import { get, type Writable } from 'svelte/store';
import { Polygon } from './Polygon';
import { canvasStore } from '$stores/canvas';
import { removeDuplicates } from '../common/removeDuplicates';
import type { Position } from '$types/canvas';
import { updateElements } from '$stores/canvas/functions';
import AbstractShapeManager from '../AbstractShapeManager';
import { calculateRelativePositionFromAbsolute } from '../common/mousePositionCalculator';

export class PolygonManager extends AbstractShapeManager {
	private _currentElement: Polygon | null;
	private _startX = 0;
	private _startY = 0;
	private isControlPoint: boolean = false;

	elements = canvasStore.elements as Writable<Polygon[]>; // 전역
	sam = canvasStore.sam;

	constructor(ctx: CanvasRenderingContext2D) {
		super(ctx);
		this._currentElement = null;

		this.history.subscribe(() => {
			const incompleteElement = get(this.elements).find((element) => !element.isComplete);

			this._currentElement = incompleteElement || null;

			if (this._currentElement) {
				this.action.set('drawing');
				this.selectedTool.set('polygon');
				this.selectedElement.unselect();
			} else {
				this.action.set('none');
			}
		});
	}

	/** 마우스 커서 스타일을 변경하기 위한 함수 */
	private setMouseCursorStyle(offsetX: number, offsetY: number) {
		const selectedTool = get(this.selectedTool);

		switch (selectedTool) {
			case 'move':
				return;

			case 'polygon': {
				const isControlPoint = this._currentElement?.controlPointClicked(offsetX, offsetY);
				this.mouseCursorStyle.set(isControlPoint ? 'pointer' : 'crosshair');
				return;
			}

			case 'smartPolygon':
				this.mouseCursorStyle.set(
					get(this.action) === 'smart-polygon-negative' ? 'not-allowed' : 'copy'
				);
				return;

			case 'comment':
				this.mouseCursorStyle.set('copy');
				return;
		}

		const selectedElement = get(this.selectedElement);

		// 마지막에 추가된 폴리곤부터 선택하기 위해 reverse
		const elements = [...get(this.elements)].reverse();

		for (const element of elements) {
			if (selectedElement?.id === element.id) {
				const isCorner = element.findPointOnVertex(offsetX, offsetY);
				if (isCorner) {
					this.applyHoverEffectById.set(element.id);
					this.mouseCursorStyle.set('pointer');
					return;
				}

				const isBoundary = element.findPointOnBoundary(offsetX, offsetY);
				if (isBoundary) {
					this.applyHoverEffectById.set(element.id);
					this.mouseCursorStyle.set('copy');
					return;
				}
			}

			const isInside = element.findPointInsidePolygon(offsetX, offsetY);
			if (isInside) {
				this.applyHoverEffectById.set(element.id);
				this.mouseCursorStyle.set('move');
				return;
			}
		}

		this.mouseCursorStyle.set('default');
		this.applyHoverEffectById.set(null);
	}

	protected createElement(offsetX: number, offsetY: number, isContextMenu: boolean) {
		// 마우스 우클릭 시 라벨 생성 방지
		if (isContextMenu) return;

		if (!this._currentElement) {
			const selectedClass = get(this.selectedClass);
			const element = new Polygon();
			element.init(selectedClass.name, selectedClass.color);
			element.create(offsetX, offsetY);
			this._currentElement = element;
			this.action.set('drawing');
		} else {
			const controlPoint = this._currentElement.controlPointClicked(offsetX, offsetY);
			if (controlPoint) {
				this._currentElement.draggingPointIndex = controlPoint;
				this.isControlPoint = true;
			} else {
				this._currentElement.create(offsetX, offsetY);
				this._currentElement.completePolygon(); // 다각형 완성 여부 확인
				this.isControlPoint = false;
				if (this._currentElement.isComplete) {
					this._currentElement.points.pop(); // 마지막 점 제거 (첫 번째 점과 중복되므로)
				}
			}
		}

		const element = this._currentElement;

		const newElements = [...get(this.elements), element];
		const elements = removeDuplicates(newElements);
		this.history.setState([...elements]);
	}

	protected selectElement(offsetX: number, offsetY: number, isContextMenu: boolean) {
		// 마지막에 추가된 폴리곤부터 선택하기 위해 reverse
		const elements = [...get(this.elements)].reverse();

		for (const element of elements) {
			// 선택된 폴리곤이 있는 경우에만 실행
			const selectedElement = get(this.selectedElement);
			if (selectedElement?.id !== element.id) continue;

			// 폴리곤 꼭짓점 수정 로직
			const foundOnVertexMouse = element.findPointOnVertex(offsetX, offsetY);

			if (foundOnVertexMouse) {
				const { dragOffsetX, dragOffsetY, position } = foundOnVertexMouse;
				element.setDragOffsets(dragOffsetX, dragOffsetY, position);
				this.selectedElement.select(element);
				// 마우스 우클릭 시 라벨 수정 방지
				if (!isContextMenu) {
					this.action.set('updating');
				}
				return;
			}

			// 폴리곤 꼭짓점 추가 로직
			const foundLineUnderMouse = element.findPointOnBoundary(offsetX, offsetY);

			if (foundLineUnderMouse) {
				const { dragOffsetX, dragOffsetY, position } = foundLineUnderMouse;
				element.setDragOffsets(dragOffsetX, dragOffsetY, position);
				this.selectedElement.select(element);
				// 마우스 우클릭 시 라벨 수정 방지
				if (!isContextMenu) {
					(selectedElement as Polygon).addPoint(offsetX, offsetY);
					this.action.set('updating');
				}
				return;
			}
		}

		// 폴리곤 이동 로직
		for (const element of elements) {
			const foundInsidePolygonMouse = element.findPointInsidePolygon(offsetX, offsetY);
			if (foundInsidePolygonMouse) {
				const { dragOffsetX, dragOffsetY } = foundInsidePolygonMouse;
				element.setDragOffsets(dragOffsetX, dragOffsetY, null);
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
		this._startX = offsetX;
		this._startY = offsetY;

		const selectedTool = get(this.selectedTool);
		if (selectedTool === 'move') return;

		if (selectedTool === 'polygon') {
			this.createElement(offsetX, offsetY, isContextMenu);
		} else if (selectedTool === 'select') {
			this.selectElement(offsetX, offsetY, isContextMenu);
		}
	};

	handleMouseMove = (offsetX: number, offsetY: number) => {
		this.setMouseCursorStyle(offsetX, offsetY);

		const selectedTool = get(this.selectedTool);
		const action = get(this.action);

		switch (action) {
			case 'drawing':
				{
					if (!this._currentElement) return;
					const element = get(this.elements)[get(this.elements).length - 1];
					element.bezierCurveTo(offsetX, offsetY, this.isControlPoint);
				}
				break;
			case 'moving':
				{
					const selectedElement = get(this.selectedElement);
					if (!selectedElement) return;

					selectedElement.move(offsetX, offsetY);
				}
				break;
			case 'updating':
				{
					const selectedElement = get(this.selectedElement);
					if (!selectedElement) return;

					(selectedElement as Polygon).updatePoint(offsetX, offsetY);
				}
				break;
			default:
				break;
		}

		if (selectedTool === 'smartPolygon') {
			const samElements = get(this.sam).elements;
			// 폴리곤 이동 로직
			if (!samElements) return;
			const isNegative = samElements.some((element) =>
				element.findPointInsidePolygon(offsetX, offsetY)
			);
			this.action.set(isNegative ? 'smart-polygon-negative' : 'smart-polygon-positive');
		}
	};

	private async smartPolygon(offsetX: number, offsetY: number) {
		const samHistory = canvasStore.samHistory;
		const action = get(this.action);
		if (action === 'smart-polygon-negative') {
			samHistory.negative(offsetX, offsetY);
		} else {
			samHistory.positive(offsetX, offsetY);
		}
	}

	handleMouseUp = (offsetX: number, offsetY: number) => {
		// 무분별한 상태값(history) 저장 방지를 위한 변수
		const hasMouseMoved = this._startX !== offsetX && this._startY !== offsetY;

		const selectedTool = get(this.selectedTool);
		if (selectedTool === 'move') return;

		if (selectedTool === 'smartPolygon') {
			this.smartPolygon(offsetX, offsetY);
		} else {
			const action = get(this.action);
			switch (action) {
				case 'drawing':
					{
						const element = get(this.elements)[get(this.elements).length - 1];
						element.draggingPointIndex = -1;
						this.isControlPoint = false;
						updateElements(element, true);
					}
					break;

				case 'moving':
				case 'updating':
					{
						const selectedElement = get(this.selectedElement);
						if (hasMouseMoved && selectedElement) {
							updateElements(selectedElement);
						}
					}
					this.action.set('none');
					break;

				default:
					break;
			}
		}
	};

	handleDbClick = (offsetX: number, offsetY: number) => {
		const selectedTool = get(this.selectedTool);
		if (selectedTool !== 'select') return;

		const elements = get(this.elements);

		// 폴리곤 꼭짓점 삭제 로직
		for (const element of elements) {
			const selectedElement = get(this.selectedElement);
			if (!selectedElement) return;

			const isPointOnVertex = element.findPointOnVertex(offsetX, offsetY);
			if (isPointOnVertex) {
				(selectedElement as Polygon).removePoint();

				updateElements(selectedElement);
				break;
			}
		}
	};

	drawSamPoints() {
		const points = get(this.sam).samPoints;
		if (!points.length) return;
		for (const point of points) {
			const { x, y, type } = point;
			const { x: relativeX, y: relativeY } = calculateRelativePositionFromAbsolute(x, y);
			this.ctx.beginPath();
			this.ctx.fillStyle = type === 1 ? 'lime' : 'red';
			this.ctx.fillRect(relativeX, relativeY, this.ctx.lineWidth * 3, this.ctx.lineWidth * 3);
			this.ctx.closePath();
		}
	}

	draw(relativeMousePos: Position | null = null) {
		get(this.elements).forEach((element) => {
			element.draw(this.ctx, null);
			if (!element.isComplete) {
				element.draw(this.ctx, relativeMousePos, this.isControlPoint);
			}
		});

		const samElements = get(this.sam).elements;
		if (samElements) {
			samElements.forEach((element) => {
				element.draw(this.ctx, null);
			});
			this.drawSamPoints();
		}
	}
}
