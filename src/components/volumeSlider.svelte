<script lang="ts">
	import IconVolumeHigh from '~icons/mdi/volume-high';
	import IconVolumeMedium from '~icons/mdi/volume-medium';
	import IconVolumeLow from '~icons/mdi/volume-low';
	import IconVolumeMuted from '~icons/mdi/volume-off';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { volume, muted } from '../stores';

	$: icon = $muted
		? IconVolumeMuted
		: $volume > 0.7
		? IconVolumeHigh
		: $volume > 0.3
		? IconVolumeMedium
		: $volume > 0
		? IconVolumeLow
		: IconVolumeMuted;
</script>

<div class="flex items-center">
	<div class="w-24">
		<RangeSlider name="volume-slider" bind:value={$volume} step={0.01} max={1.0} />
	</div>
	<button on:click={(_) => ($muted = !$muted)}
		><svelte:component this={icon} class="w-7 h-7" /></button
	>
</div>
