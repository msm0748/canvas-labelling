import { INITIAL_POSITION } from '$lib/constants/canvas';
import { canvasStore } from '$stores/canvas';
import type { Action } from '$types/Canvas';
import _ from 'lodash';
import { get } from 'svelte/store';

export default abstract class BaseShapeManager {
	protected action: Action = 'none';
	/** select 시 수정이 없는데 history에 데이터가 쌓이는 것을 방지하기 위해 */
	protected startPos = INITIAL_POSITION;
	protected $selectedClass = canvasStore.selectedClass;
	protected $selectedTool = canvasStore.selectedTool;
	protected $selectedElement = canvasStore.selectedElement;
	protected $elements = canvasStore.elements;
	protected $history = canvasStore.history;
	protected $mouseCursorStyle = canvasStore.mouseCursorStyle;

	private historyUnsubscribe = this.$history.subscribe((state) => {
		// console.log('구독');
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
	public abstract onLeftMouseDown(offsetX: number, offsetY: number): void;
	public abstract onRightMouseDown(offsetX: number, offsetY: number): void;
	public abstract onMouseMove(offsetX: number, offsetY: number): void;
	public abstract onMouseUp(offsetX: number, offsetY: number): void;

	public destroy() {
		this.historyUnsubscribe();
	}
}
