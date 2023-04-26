<script lang="ts">
	import VirtualList from 'svelte-tiny-virtual-list';
	import { currentTrack, queue, queuePosition, tracks } from '../../stores';
	import TrackComponent from '../../components/track.svelte';
	import type { TrackWithId } from '../../types';
	import IconRemove from '~icons/mdi/minus-thick';
	import { get } from 'svelte/store';

	$: trackCount = $queue.length;
	let trackItemSize = 62;
	let listHeight = 0;

	$: getTrack = (index: number): TrackWithId => {
		let id = $queue.at(index)!;
		let track = $tracks.get(id)!;
		return { id, track };
	};
</script>

<div class="h-full" bind:offsetHeight={listHeight}>
	<VirtualList
		height={listHeight}
		itemSize={trackItemSize}
		itemCount={trackCount}
		overscanCount={3}
		getKey={(index) => $queue.at(index)}
	>
		<div slot="item" let:index let:style {style}>
			<div class="flex pt-2 pl-2 max-sm:pr-4">
				<TrackComponent track_with_id={getTrack(index)} />
				<button
					title="remove track"
					class="mr-2 ml-auto btn px-3 hover:variant-soft-primary"
					on:click={(_) => {
						queue.update((q) => {
							q.splice(index, 1);
							return q;
						});
						const curTrack = $currentTrack;
						if (curTrack !== null) {
							const newPos = $queue.indexOf(curTrack.id);
							queuePosition.set(newPos === -1 ? null : newPos);
						}
					}}
				>
					<IconRemove class="w-7 h-7" />
				</button>
			</div>
			<hr class="w-full mt-1.5" />
		</div>
	</VirtualList>
</div>
