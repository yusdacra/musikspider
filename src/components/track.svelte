<script lang="ts">
	import type { Track } from '../types';
	import { address, token } from '../stores';
	import Spinnny from '~icons/line-md/loading-loop';
	import IconPlay from '~icons/mdi/play';

	export let track: Track;

	$: url = `http://${$address}/thumbnail/${track.thumbnail_id}?token=${$token}`;
	let showSpinner = false;
	let isError = false;
</script>

<div class="card flex gap-4 m-2 p-2 w-fit max-w-full">
	<button class="relative w-12 h-12 invisible hover:visible">
		<div class="visible rounded placeholder w-12 h-12" />
		<Spinnny class="absolute top-1 left-1 w-10 h-10 {showSpinner ? 'visible' : 'hidden'}" />
		<!-- svelte-ignore a11y-missing-attribute -->
		<img
			src={url}
			class="absolute top-0 left-0 rounded w-12 h-12 {showSpinner || isError
				? 'hidden'
				: 'visible'}"
			on:error={() => {
				isError = true;
				showSpinner = false;
			}}
			on:loadstart={() => (showSpinner = true)}
			on:load={() => (showSpinner = false)}
		/>
		<IconPlay
			class="absolute top-0 left-0 w-12 h-12 rounded variant-glass-surface backdrop-blur-sm"
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
