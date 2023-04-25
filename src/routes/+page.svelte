<script lang="ts">
	import VirtualList from 'svelte-tiny-virtual-list';
	import { tracks, tracksSorted } from '../stores';
	import TrackComponent from '../components/track.svelte';
	import type { Track, TrackWithId } from '../types';

	$: trackCount = $tracksSorted.size;
	let trackItemSize = 62;
	let listHeight = 0;

	function getTrack(index: number): TrackWithId {
		let id = $tracksSorted.get(index)!;
		let track = $tracks.get(id)!;
		return { id, track };
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
			<div class="max-sm:pr-4"><TrackComponent track_with_id={getTrack(index)} /></div>
		</div>
	</VirtualList>
</div>
