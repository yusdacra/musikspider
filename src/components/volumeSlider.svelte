<script lang="ts">
	import IconVolumeHigh from '~icons/mdi/volume-high';
	import IconVolumeMedium from '~icons/mdi/volume-medium';
	import IconVolumeLow from '~icons/mdi/volume-low';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import type { ResourceId } from '../types';
	import { currentTrack, volume } from '../stores';

	function getAudioElement(id: ResourceId | null) {
		const elem = document.getElementById(`audio-source-${id}`);
		if (elem === null) {
			return null;
		}
		return elem as HTMLAudioElement;
	}

	$: audioElem = getAudioElement($currentTrack?.id ?? null);
</script>

<div class="flex items-center">
	<div class="w-24">
		<RangeSlider name="volume-slider" bind:value={$volume} step={0.01} max={1.0} />
	</div>
	<IconVolumeHigh class="w-7 h-7" />
</div>
