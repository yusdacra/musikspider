<script lang="ts">
	import {
		makeAudioUrl,
		makeThumbnailUrl,
		currentTrack,
		volume,
		muted,
		paused,
		nextQueuePosition,
		getAudioElement,
		loop,
		queuePosition,
		prevQueuePosition
	} from '../stores';
	import IconPlay from '~icons/mdi/play';
	import IconPause from '~icons/mdi/pause';
	import IconMusic from '~icons/mdi/music';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { LoopKind } from '../types';

	$: track = $currentTrack?.track;
	$: track_id = $currentTrack?.id;
	$: thumbUrl = track ? makeThumbnailUrl(track.thumbnail_id) : null;
	$: audioUrl = track_id ? makeAudioUrl(track_id) : null;

	function calculateMinuteSecond(seconds: number) {
		let secs = Math.floor(seconds);
		let secsLeftover = secs % 60;
		let minutes = (secs - secsLeftover) / 60;

		let secondsFormatted = secsLeftover < 10 ? `0${secsLeftover}` : `${secsLeftover}`;
		let minutesFormatted = minutes < 10 ? `0${minutes}` : `${minutes}`;

		return `${minutesFormatted}:${secondsFormatted}`;
	}

	let currentTime = 0;
	let duration = 0;

	let isError = false;
	let showIcon = false;
</script>

<div class="flex gap-2 z-10">
	{#if audioUrl !== null}
		<audio
			id="audio-source"
			src={audioUrl}
			autoplay
			bind:paused={$paused}
			bind:currentTime
			bind:duration
			bind:muted={$muted}
			bind:volume={$volume}
			on:loadstart={(_) => {
				let mediaSession = navigator.mediaSession;
				let artwork = [];
				if (thumbUrl !== null) {
					artwork.push({ src: thumbUrl });
				}
				mediaSession.metadata = new MediaMetadata({
					title: track?.title,
					album: track?.album_title,
					artist: track?.artist_name,
					artwork
				});
				mediaSession.setPositionState({ position: currentTime, duration });
				mediaSession.setActionHandler('nexttrack', () => nextQueuePosition());
				mediaSession.setActionHandler('previoustrack', () => prevQueuePosition());
				mediaSession.setActionHandler('seekto', (ev) => {
					if (ev.seekTime !== undefined) {
						currentTime = ev.seekTime;
					}
				});
				mediaSession.setActionHandler('seekbackward', () => (currentTime -= 5));
				mediaSession.setActionHandler('seekforward', () => (currentTime += 5));
			}}
			on:timeupdate={(_) => {
				navigator.mediaSession.setPositionState({ position: currentTime, duration });
			}}
			on:ended={(ev) => {
				currentTime = 0;
				switch ($loop) {
					case LoopKind.Off:
						duration = 0;
						nextQueuePosition(true);
						break;
					case LoopKind.Once:
						const queuePos = nextQueuePosition(true);
						if (queuePos === null) {
							queuePosition.set(0);
						}
						break;
					case LoopKind.Always:
						ev.currentTarget.play();
						break;
				}
			}}
		/>
	{/if}
	<button
		class="relative rounded-none placeholder w-12 h-12"
		on:pointerenter={(_) => (showIcon = true)}
		on:pointerleave={(_) => (showIcon = false)}
		on:click={(_) => {
			let elem = getAudioElement();
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
		<IconPlay
			class="child play-icon variant-glass-surface {showIcon && $paused
				? 'opacity-100'
				: 'opacity-0'}"
		/>
		<IconPause
			class="child play-icon variant-glass-surface {showIcon && !$paused
				? 'opacity-100'
				: 'opacity-0'}"
		/>
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
		@apply transition-opacity backdrop-blur-sm;
	}
	button :global(.child) {
		@apply absolute top-0 left-0 w-12 h-12;
	}
	div :global(.range-content) {
		@apply p-0;
	}
</style>
