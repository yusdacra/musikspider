<script lang="ts">
	import type { TrackWithId } from '../types';
	import { makeThumbnailUrl, currentTrack, setQueuePositionTo, getAudioElement } from '../stores';
	import Spinnny from '~icons/line-md/loading-loop';
	import IconPlay from '~icons/mdi/play';
	import IconMusic from '~icons/mdi/music';

	export let track_with_id: TrackWithId;
	let track = track_with_id.track;
	let track_id = track_with_id.id;

	$: thumbUrl = makeThumbnailUrl(track.thumbnail_id);
	let showSpinner = false;
	let isError = false;
	let showPlayIcon = false;
</script>

<div class="flex gap-2 w-fit max-w-full">
	<button
		id={`track-${track_id}`}
		class="relative placeholder rounded min-w-[3rem] min-h-[3rem]"
		on:click={(_) => {
			setQueuePositionTo(track_id);
			const elem = getAudioElement();
			if (elem !== null) {
				elem.currentTime = 0;
			}
		}}
		on:pointerenter={(_) => (showPlayIcon = true)}
		on:pointerleave={(_) => (showPlayIcon = false)}
	>
		<IconMusic class="absolute top-1 left-1 w-10 h-10" />
		<Spinnny
			class="absolute play-icon variant-glass-surface top-1 left-1 w-10 h-10 {showSpinner
				? 'visible'
				: 'hidden'}"
		/>
		<!-- svelte-ignore a11y-missing-attribute -->
		<img
			src={thumbUrl}
			class="child {showSpinner || isError ? 'hidden' : ''}"
			on:error={() => {
				isError = true;
				showSpinner = false;
			}}
			on:loadstart={() => (showSpinner = true)}
			on:load={() => (showSpinner = false)}
		/>
		<IconPlay
			class="child play-icon variant-glass-surface {showPlayIcon ? 'opacity-100' : 'opacity-0'}"
		/>
	</button>
	<div class="whitespace-nowrap overflow-ellipsis overflow-hidden">
		<span>#{track.track_num} - {track.title}</span>
		<div class="text-sm whitespace-nowrap overflow-ellipsis overflow-hidden">
			<span
				class="badge variant-filled-primary py-0.5 {$currentTrack?.id === track_id
					? 'visible'
					: 'hidden'}">playing</span
			>
			<span class="opacity-70">{track.album_title ? `from ${track.album_title}` : ''}</span>
			<span class="opacity-40">{track.artist_name ? `by ${track.artist_name}` : ''}</span>
		</div>
	</div>
</div>

<style lang="postcss">
	button :global(.play-icon) {
		@apply transition-opacity backdrop-blur-sm;
	}
	button :global(.child) {
		@apply rounded absolute top-0 left-0 w-12 h-12;
	}
</style>
