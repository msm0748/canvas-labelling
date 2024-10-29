import { canvasStore } from '$stores/canvas';
import type { Action, Position } from '$types/Canvas';
import _ from 'lodash';
import { get } from 'svelte/store';

export default abstract class AbstractShapeManager {
	protected ctx: CanvasRenderingContext2D;
	protected action: Action = 'none';
	protected $selectedClass = canvasStore.selectedClass;
	protected $selectedTool = canvasStore.selectedTool;
	protected $selectedElement = canvasStore.selectedElement;
	protected $elements = canvasStore.elements;
	protected $history = canvasStore.history;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	private historyUnsubscribe = this.$history.subscribe((state) => {
		console.log('구독');
		console.log(state, 'State');
		this.$elements.set(_.cloneDeep(state.history[state.index]) || []);

		// 선택된 폴리곤 최신상태 유지
		const selectedElement = get(this.$selectedElement);
		if (selectedElement) {
			const newSelectedElement = get(this.$elements).find(
				(element) => element.id === selectedElement.id
			);
			if (newSelectedElement) this.$selectedElement.select(newSelectedElement);
			else this.$selectedElement.reset();
		}
	});

	protected abstract createElement(offsetX: number, offsetY: number): void;
	protected abstract selectElement(offsetX: number, offsetY: number): void;
	public abstract onMouseDown(offsetX: number, offsetY: number): void;
	public abstract onMouseMove(offsetX: number, offsetY: number): void;
	public abstract onMouseUp(offsetX: number, offsetY: number): void;

	/**
	 * @param {Position | null} relativeMousePos - 폴리곤을 그리는 동안 마우스의 현재 위치를 사용하여 선을 연결하기 위한 좌표,
	 */
	public abstract draw(relativeMousePos: Position | null): void;

	public destroy() {
		this.historyUnsubscribe();
	}
}
