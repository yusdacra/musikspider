<script lang="ts">
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../../../app.postcss';

	import IconMusic from '~icons/mdi/music';
	import IconPlay from '~icons/mdi/play';
	import IconPause from '~icons/mdi/pause';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { calculateMinuteSecond, getAudioElement, interceptKeys } from '../../../utils';

	export let data;

	function getAlbumArtistInfo() {
		const hasArtist = data.info.artist;
		const hasAlbum = data.info.album;

		if (hasArtist && hasAlbum) {
			return `from ${data.info.album}\nby ${data.info.artist}`;
		} else if (hasArtist) {
			return `by ${data.info.artist}`;
		} else if (hasAlbum) {
			return `from ${data.info.album}`;
		} else {
			return '';
		}
	}

	let showIcon = false;
	let isError = false;

	let paused = false;
	let currentTime = 0;
	let duration = 0;
</script>

<svelte:window on:keydown={interceptKeys()} />

<svelte:head>
	<title>{data.info.title} {data.info.artist !== '' ? `- ${data.info.artist}` : ''}</title>
	<meta property="og:title" content={data.info.title} />
	<meta property="og:description" content={getAlbumArtistInfo()} />
	<meta property="og:image" content={data.thumbnail_url} />
	<meta property="og:audio" content={data.audio_url} />
	<meta name="theme-color" content={data.color} />
</svelte:head>

<div
	class="
		absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]
		flex w-fit max-w-full p-2 gap-2 rounded
	"
>
	<audio
		id="audio-source"
		src={data.audio_url}
		autoplay
		bind:paused
		bind:currentTime
		bind:duration
	/>
	<button
		class="relative rounded placeholder w-16 h-16"
		on:pointerenter={(_) => (showIcon = true)}
		on:pointerleave={(_) => (showIcon = false)}
		on:click={(_) => {
			let elem = getAudioElement();
			if (elem) {
				elem.paused ? elem.play() : elem.pause();
			}
		}}
	>
		<IconMusic class="absolute top-1 left-1 w-14 h-14" />
		<!-- svelte-ignore a11y-missing-attribute -->
		<img
			src={data.thumbnail_url}
			class="child {isError ? 'hidden' : ''}"
			on:error={() => (isError = true)}
			on:load={() => (isError = false)}
		/>
		<svelte:component
			this={paused ? IconPlay : IconPause}
			class="
				child play-icon variant-glass-surface
				{showIcon ? 'opacity-100' : 'opacity-0'}
			"
		/>
	</button>
	<div class="flex flex-col gap-1 w-[24rem] max-md:w-[18rem]">
		<div class="text-overflow-ellipsis">
			<span>{data.info.title}</span>
			<div class="text-sm text-overflow-ellipsis">
				<span class="opacity-70">{data.info.album !== '' ? `from ${data.info.album}` : ''}</span>
				<span class="opacity-40">{data.info.artist !== '' ? `by ${data.info.artist}` : ''}</span>
			</div>
		</div>
		<div class="flex items-center gap-1">
			<RangeSlider
				name="progress"
				bind:value={currentTime}
				max={duration}
				step={0.01}
				class="w-[22rem] max-md:w-[16rem]"
			/>
			<span class="text-xs opacity-70 w-[2rem]">{calculateMinuteSecond(currentTime)}</span>
		</div>
	</div>
</div>

<style lang="postcss">
	button :global(.play-icon) {
		@apply transition-opacity backdrop-blur-sm;
	}
	button :global(.child) {
		@apply absolute rounded top-0 left-0 w-16 h-16;
	}
	div :global(.range-content) {
		@apply p-0;
	}
	div :global(.text-overflow-ellipsis) {
		@apply whitespace-nowrap overflow-ellipsis overflow-hidden;
	}
</style>
