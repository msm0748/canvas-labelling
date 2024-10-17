import { canvasStore } from '$stores/canvas';
import { get } from 'svelte/store';

export default class ImageManager {
	private _imageInfo = canvasStore.imageInfo;

	public draw(ctx: CanvasRenderingContext2D) {
		const _imageInfo = get(this._imageInfo);

		if (_imageInfo) {
			ctx.drawImage(
				_imageInfo.element,
				_imageInfo.x,
				_imageInfo.y,
				_imageInfo.width,
				_imageInfo.height
			);
		}
	}
}
