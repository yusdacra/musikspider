<script lang="ts">
	import VirtualList from 'svelte-tiny-virtual-list';
	import { tracks, tracksSorted } from '../stores';
	import Track from '../components/track.svelte';

	$: trackCount = $tracksSorted.size;
	let trackItemSize = 60;
</script>

<VirtualList height={trackCount * trackItemSize} itemSize={trackItemSize} itemCount={trackCount}>
	<div slot="item" let:index let:style {style}>
		<Track track={$tracks.get($tracksSorted.get(index) ?? BigInt(0))} />
	</div>
</VirtualList>
