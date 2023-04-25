<script lang="ts">
	import type { TrackWithId } from '../types';
	import { playingNow, makeThumbnailUrl, address, token } from '../stores';
	import Spinnny from '~icons/line-md/loading-loop';
	import IconPlay from '~icons/mdi/play';

	export let track_with_id: TrackWithId;
	let track = track_with_id.track;

	$: url = makeThumbnailUrl($address, $token, track.thumbnail_id);
	let showSpinner = false;
	let isError = false;
	let showPlayIcon = false;
</script>

<div class="card flex gap-2 m-2 p-1 w-fit max-w-full">
	<button
		class="relative placeholder rounded min-w-[3rem] min-h-[3rem]"
		on:click={(_) => playingNow.set(track_with_id)}
		on:pointerenter={(_) => (showPlayIcon = true)}
		on:pointerleave={(_) => (showPlayIcon = false)}
	>
		<Spinnny class="top-1 left-1 w-10 h-10 {showSpinner ? 'visible' : 'hidden'}" />
		<!-- svelte-ignore a11y-missing-attribute -->
		<img
			src={url}
			class="top-0 left-0 w-12 h-12 rounded {showSpinner || isError ? 'hidden' : ''}"
			on:error={() => {
				isError = true;
				showSpinner = false;
			}}
			on:loadstart={() => (showSpinner = true)}
			on:load={() => (showSpinner = false)}
		/>
		<IconPlay
			class="absolute top-0 left-0 w-12 h-12 rounded variant-glass-surface backdrop-blur-sm {showPlayIcon
				? 'visible'
				: 'hidden'}"
		/>
	</button>
	<div class="whitespace-nowrap overflow-ellipsis overflow-hidden">
		#{track.track_num} - {track.title}
		<div class="text-sm whitespace-nowrap overflow-ellipsis overflow-hidden">
			<span class="opacity-70">{track.album_title ? `from ${track.album_title}` : ''}</span>
			<span class="opacity-40">{track.artist_name ? `by ${track.artist_name}` : ''}</span>
		</div>
	</div>
</div>
