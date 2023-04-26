<script lang="ts">
	import {
		makeAudioUrl,
		makeThumbnailUrl,
		currentTrack,
		queuePosition,
		queue,
		volume
	} from '../stores';
	import IconPlay from '~icons/mdi/play';
	import IconPause from '~icons/mdi/pause';
	import IconMusic from '~icons/mdi/music';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import type { ResourceId } from '../types';

	$: track = $currentTrack?.track;
	$: track_id = $currentTrack?.id;
	$: thumbUrl = track ? makeThumbnailUrl(track.thumbnail_id) : null;
	$: audioUrl = track_id ? makeAudioUrl(track_id) : null;

	function getAudioElement(id: ResourceId | null) {
		const elem = document.getElementById(`audio-source-${id}`);
		if (elem === null) {
			return null;
		}
		return elem as HTMLAudioElement;
	}

	function calculateMinuteSecond(seconds: number) {
		let secs = Math.floor(seconds);
		let secsLeftover = secs % 60;
		let minutes = (secs - secsLeftover) / 60;

		let secondsFormatted = secsLeftover < 10 ? `0${secsLeftover}` : `${secsLeftover}`;
		let minutesFormatted = minutes < 10 ? `0${minutes}` : `${minutes}`;

		return `${minutesFormatted}:${secondsFormatted}`;
	}

	let isPaused = false;
	let currentTime = 0;
	let duration = 0;

	let isError = false;
	let showIcon = false;
</script>

<div class="flex gap-2 z-10">
	{#if audioUrl !== null}
		<audio
			id="audio-source-{track_id}"
			src={audioUrl}
			autoplay
			bind:paused={isPaused}
			bind:currentTime
			bind:duration
			bind:volume={$volume}
			on:ended={(_) => {
				const pos = $queuePosition;
				if (pos !== null) {
					const _newPos = pos + 1;
					const newPos = _newPos < $queue.length ? _newPos : null;
					duration = 0;
					currentTime = 0;
					queuePosition.set(newPos);
				}
			}}
		/>
	{/if}
	<button
		class="relative placeholder w-12 h-12"
		on:pointerenter={(_) => (showIcon = true)}
		on:pointerleave={(_) => (showIcon = false)}
		on:click={(_) => {
			let elem = getAudioElement(track_id ?? null);
			if (elem) {
				elem.paused ? elem.play() : elem.pause();
			}
		}}
	>
		<IconMusic class="absolute top-1 left-1 w-10 h-10" />
		<!-- svelte-ignore a11y-missing-attribute -->
		{#if thumbUrl !== null}
			<img
				src={thumbUrl}
				class="child {isError ? 'hidden' : ''}"
				on:error={() => (isError = true)}
				on:load={() => (isError = false)}
			/>
		{/if}
		<IconPlay class="child play-icon {showIcon && isPaused ? 'opacity-100' : 'opacity-0'}" />
		<IconPause class="child play-icon {showIcon && !isPaused ? 'opacity-100' : 'opacity-0'}" />
	</button>
	<div class="flex flex-col gap-1">
		<div
			title={track?.title ?? 'Not playing'}
			class="w-80 max-md:w-44 max-sm:w-32 whitespace-nowrap overflow-ellipsis overflow-hidden"
		>
			{track?.title ?? 'Not playing'}
		</div>
		<div class="flex items-center gap-1">
			<RangeSlider
				name="progress"
				bind:value={currentTime}
				max={duration}
				step={0.01}
				class="w-72 max-md:w-36 max-sm:w-24"
			/>
			<div class="text-xs opacity-70 w-8">{calculateMinuteSecond(currentTime)}</div>
		</div>
	</div>
</div>

<style lang="postcss">
	button :global(.play-icon) {
		@apply transition-opacity variant-glass-surface backdrop-blur-sm;
	}
	button :global(.child) {
		@apply absolute top-0 left-0 w-12 h-12;
	}
	div :global(.range-content) {
		@apply p-0;
	}
</style>
