import { INITIAL_SELECTED_TOOL } from '$lib/constants/canvas';
import { canvasStore } from '$stores/canvas';
import { deleteElement, redo, undo } from '$stores/canvas/functions';
import { get } from 'svelte/store';

export default class KeyboardController {
	private static instance: KeyboardController | null = null;
	private $selectedTool = canvasStore.selectedTool;
	private $selectedElement = canvasStore.selectedElement;
	private beforeSelectedTool = INITIAL_SELECTED_TOOL;

	constructor() {
		if (KeyboardController.instance) {
			return KeyboardController.instance;
		}

		KeyboardController.instance = this;
	}

	// 이전 선택된 도구를 저장하는 메서드
	private savePreviousTool = () => {
		const selectedTool = get(this.$selectedTool);

		if (selectedTool !== 'move') {
			this.beforeSelectedTool = selectedTool;
			console.log(this.beforeSelectedTool);
		}
		this.$selectedTool.select('move');
	};

	// 저장된 이전 선택 도구를 가져오는 메서드
	private getPreviousTool = () => {
		this.$selectedTool.select(this.beforeSelectedTool);
		this.beforeSelectedTool = 'move';
	};

	public onKeyDown = (e: KeyboardEvent) => {
		if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
			if (e.shiftKey) {
				redo();
			} else {
				undo();
			}

			return;
		}

		switch (e.code) {
			case 'Space':
				this.savePreviousTool();
				break;

			case 'KeyV':
				this.$selectedTool.select('select');
				break;
			case 'KeyM':
				this.$selectedTool.select('move');
				break;

			case 'KeyB':
				this.$selectedTool.select('rectangle');
				break;

			case 'Backspace':
			case 'Delete':
				deleteElement();
				break;

			default:
				break;
		}
	};

	public onKeyUp = (e: KeyboardEvent) => {
		switch (e.code) {
			case 'Space':
				this.getPreviousTool();
				break;

			default:
				break;
		}
	};

	public destroy() {
		KeyboardController.instance = null;
	}
}
