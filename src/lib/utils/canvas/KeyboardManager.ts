import { INITIAL_SELECTED_TOOL } from '$lib/constants/canvas';
import { canvasStore } from '$stores/canvas';
import { deleteElement, redo, undo, zoomIn, zoomOut } from '$stores/canvas/functions';
import type { Label } from '$types/canvas';
import { get } from 'svelte/store';

export default class KeyboardManager {
	private static instance: KeyboardManager | null = null;
	private label: Label;
	private _beforeSelectedTool = INITIAL_SELECTED_TOOL;

	elements = canvasStore.elements;
	selectedTool = canvasStore.selectedTool;
	scale = canvasStore.scale;
	history = canvasStore.history;
	samHistory = canvasStore.samHistory;
	selectedElement = canvasStore.selectedElement;
	action = canvasStore.action;

	constructor(label: Label) {
		if (KeyboardManager.instance) {
			return KeyboardManager.instance;
		}

		this.label = label;
		KeyboardManager.instance = this;

		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
	}

	// 인스턴스가 파괴되면 이벤트 리스너를 정리
	destroy() {
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		KeyboardManager.instance = null;
	}

	// 이전 선택된 도구를 저장하는 메서드
	savePreviousTool = () => {
		const selectedTool = get(this.selectedTool);

		if (selectedTool !== 'move') {
			this._beforeSelectedTool = selectedTool;
		}
		this.selectedTool.set('move');
	};

	// 저장된 이전 선택 도구를 가져오는 메서드
	private getPreviousTool = () => {
		this.selectedTool.set(this._beforeSelectedTool);
		this._beforeSelectedTool = 'move';
	};

	handleKeyUp = (e: KeyboardEvent) => {
		if (e.code === 'Space') this.getPreviousTool();
		if (get(this.action) === 'drawing' && e.code === 'Escape') {
			// 현재 그리기 중인 도형을 취소
			const deleteElement = get(this.elements).slice(0, -1);
			this.history.setState(deleteElement);
		}
	};

	handleKeyDown = (e: KeyboardEvent) => {
		if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
			if (e.shiftKey) {
				redo();
			} else {
				undo();
			}

			return;
		}

		switch (e.code) {
			case 'KeyV':
				this.selectedTool.set('select');
				break;
			case 'KeyM':
				this.selectedTool.set('move');
				break;
			case 'KeyP':
				if (this.label === 'polygon') {
					this.selectedTool.set('polygon');
					this.selectedElement.unselect();
				}
				break;
			case 'KeyS':
				if (this.label === 'polygon') {
					this.selectedTool.set('smartPolygon');
					this.selectedElement.unselect();
				}
				break;
			case 'KeyB':
				if (this.label === 'rectangle') {
					this.selectedTool.set('rectangle');
					this.selectedElement.unselect();
				}
				break;
			case 'KeyC':
				this.selectedTool.set('comment');
				this.selectedElement.unselect();
				break;
			case 'KeyF':
				if (this.label === 'featurePoint') {
					this.selectedTool.set('featurePoint');
					this.selectedElement.unselect();
				}
				break;
			case 'Space':
				this.savePreviousTool();
				break;
			case 'Equal':
				zoomIn();
				break;
			case 'Minus':
				zoomOut();
				break;
			case 'Delete':
			case 'Backspace':
				deleteElement();
				break;
			default:
				break;
		}
	};
}
