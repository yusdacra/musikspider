<script lang="ts">
	import VirtualList from 'svelte-tiny-virtual-list';
	import { tracks, tracksSorted } from '../../stores';
	import TrackComponent from '../../components/track.svelte';
	import type { TrackWithId } from '../../types';

	$: trackCount = $tracksSorted.length;
	let trackItemSize = 62;
	let listHeight = 0;

	function getTrack(index: number): TrackWithId {
		let id = $tracksSorted.at(index)!;
		let track = $tracks.get(id)!;
		return { id, track };
	}
</script>

<div class="h-full" bind:offsetHeight={listHeight}>
	<VirtualList
		height={listHeight}
		itemSize={trackItemSize}
		itemCount={trackCount}
		overscanCount={3}
		getKey={(index) => $tracksSorted.at(index)}
	>
		<div slot="item" let:index let:style {style}>
			<div class="pt-2 pl-2 max-sm:pr-4"><TrackComponent track_with_id={getTrack(index)} /></div>
			<hr class="w-full mt-1.5" />
		</div>
	</VirtualList>
</div>
