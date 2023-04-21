<script lang="ts">
	import type { Track } from '../types';
	import { address, token } from '../stores';

	export let track: Track;
	$: url = `http://${$address}/thumbnail/${track.thumbnail_id}?token=${$token}`;
</script>

<div class="card flex gap-2">
	<!-- svelte-ignore a11y-missing-attribute -->
	<div class="rounded placeholder w-12 h-12">
		<img
			src={url}
			loading="lazy"
			class="w-12 h-12"
			on:error={(ev) => (ev.target.style.display = 'none')}
		/>
	</div>
	{track.track_num} - {track.title}
</div>
