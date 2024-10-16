<script lang="ts">
	// import { createComment } from '$lib/api/project/project';
	import {
		calculateAbsolutePositionFromRelative,
		relativeMousePos
	} from '$lib/utils/canvas/common/mousePositionCalculator';

	interface Comment {
		id: number;
		fileId: string;
		userId: number;
		content: string;
		positionTop: number;
		positionLeft: number;
		createdAt: Date;
	}

	export let offsetY = 0;
	export let offsetX = 0;
	export let fileId: string;
	export let showComment: boolean;
	export let comments: Comment[];

	let content = '';

	const onSubmit = async () => {
		const { x: relativePosX, y: relativePosY } = relativeMousePos(offsetX, offsetY);
		const { x, y } = calculateAbsolutePositionFromRelative(relativePosX, relativePosY);
		const position = { x, y };
		// const response = await createComment(fileId, content, position);

		// const comment = await response.json();

		// comments = [...comments, comment];

		// showComment = false;
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions (because of reasons) -->
<div
	class="comment-wrapper"
	style="transform: translate({offsetX}px, {offsetY}px);"
	on:click|stopPropagation
>
	<div class="form">
		<form on:submit|preventDefault={onSubmit}>
			<textarea rows="4" bind:value={content} on:keydown|stopPropagation></textarea>
			<div class="form-btns">
				<button type="submit">전송</button>
			</div>
		</form>
	</div>
</div>

<style lang="scss">
	.comment-wrapper {
		padding: 15px;
		width: 320px;
		position: absolute;
		z-index: 9999;
		background-color: #1f2937;
		border: 2px solid #8aff7f;
		border-radius: 0 16px 16px 16px;
	}

	.form {
		background-color: #374151;
		border-radius: 8px;
		padding: 3px;

		textarea {
			width: 100%;
			height: 100%;
			background-color: transparent;
			color: #fff;
			padding: 10px;
			border: none;
			resize: none;
			outline: none;
			font-size: 14px;
		}

		.form-btns {
			border-top: 1px solid #ddd;
			padding: 10px;
		}
	}
</style>
