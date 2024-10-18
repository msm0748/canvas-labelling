import type { Rectangle } from '$lib/utils/canvas/shape/rectangle/Rectangle';

export interface Size {
	width: number;
	height: number;
}

export interface Position {
	x: number;
	y: number;
}

export interface Classes {
	id: number;
	projectId: string;
	name: string;
	createdAt: Date;
}

export interface ImageInfo {
	src: string;
	element: HTMLImageElement;
	x: number;
	y: number;
	width: number;
	height: number;
	originalWidth: number;
	originalHeight: number;
}

export type Action =
	| 'none'
	| 'moving'
	| 'drawing'
	| 'updating'
	| 'smart-polygon-negative'
	| 'smart-polygon-positive';

export type Tool =
	| 'select'
	| 'move'
	| 'polygon'
	| 'rectangle'
	| 'smartPolygon'
	| 'featurePoint'
	| 'comment';

export interface Point extends Position {
	controlPoint?: Position | null;
}

export type MouseCursorStyle =
	| 'auto'
	| 'default'
	| 'none'
	| 'pointer'
	| 'cell'
	| 'crosshair'
	| 'copy'
	| 'move'
	| 'grab'
	| 'grabbing'
	| 'col-resize'
	| 'row-resize'
	| 'nesw-resize'
	| 'nwse-resize'
	| 'not-allowed'
	| 'zoom-in'
	| 'zoom-out';

export interface SelectedClass {
	name: string;
	color: string;
}

export type RectanglePosition = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r' | 'inside';

export interface SmartPolygon {
	id: number;
	type: 'polygon';
	points: Point[];
}

export interface SamPoint extends Position {
	type: number;
}

export type Sam = {
	elements: Polygon[] | null;
	samPoints: SamPoint[];
};

export type SamHistory = {
	index: number;
	history: SamPoint[][];
};

// export type Shape = Rectangle | FeaturePoint | Polygon;
export type Shape = Rectangle;

export interface HistoryStore<T> {
	index: number;
	history: T[][];
}

export type Label = 'polygon' | 'rectangle' | 'featurePoint';
