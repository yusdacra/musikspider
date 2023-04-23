<script lang="ts">
	import VirtualList from 'svelte-tiny-virtual-list';
	import { tracks, tracksSorted } from '../stores';
	import TrackComponent from '../components/track.svelte';
	import type { Track } from '../types';

	$: trackCount = $tracksSorted.size;
	let trackItemSize = 72;
	let listHeight = 0;

	function getTrack(index: number): Track {
		return $tracks.get($tracksSorted.get(index)!)!;
	}
</script>

<div class="h-full" bind:offsetHeight={listHeight}>
	<VirtualList
		height={listHeight}
		itemSize={trackItemSize}
		itemCount={trackCount}
		overscanCount={1}
	>
		<div slot="item" let:index let:style {style}>
			<div class="pr-4 md:ml-32"><TrackComponent track={getTrack(index)} /></div>
		</div>
	</VirtualList>
</div>
