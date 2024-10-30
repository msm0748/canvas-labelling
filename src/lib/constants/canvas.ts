import type { Position, Size, Tool, Action, SelectedClass, Sam } from '$types/Canvas';

// 초기 캔버스 크기
export const INITIAL_SIZE: Size = { width: 0, height: 0 };

// 캔버스에서 마우스 이동 시 초기 위치
export const INITIAL_POSITION: Position = { x: 0, y: 0 };

// 캔버스에서 이미지를 확대/축소 할 때 초기 스케일
export const INITIAL_SCALE = 1;

// 캔버스에서 이미지를 확대/축소 할 때 최소/최대 스케일
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 10;

// 캔버스에서 마우스 휠 감도
export const ZOOM_SENSITIVITY = 0.1;

// 캔버스에서 초기 선택 도구
export const INITIAL_SELECTED_TOOL: Tool = 'select';

// 캔버스에서 라벨링 초기 액션(도구)
export const INITIAL_ACTION: Action = 'none';

// 캔버스에서 라벨링 할 때 리사이즈 초기 포인트 두께
export const INITIAL_RESIZE_POINT = 10;

// 캔버스에서 라벨링 할 때 초기 선 두께
export const INITIAL_LINE_WIDTH = 2;

// 캔버스 명도
export const INITIAL_BRIGHTNESS = 100;

export const MIN_BRIGHTNESS = 0;
export const MAX_BRIGHTNESS = 500;

// 캔버스 대비
export const INITIAL_CONTRAST = 100;

export const MIN_CONTRAST = 0;
export const MAX_CONTRAST = 500;

export const INITIAL_CLASS_SELECTOR: SelectedClass = { id: 0, label: '', color: '' };

export const INITIAL_HISTORY = {
	index: 0,
	history: [[]]
};

export const INITIAL_SAM: Sam = {
	elements: null,
	samPoints: []
};
