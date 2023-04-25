<script lang="ts">
	import { address, makeAudioUrl, makeThumbnailUrl, playingNow, token } from '../stores';
	import IconPlay from '~icons/mdi/play';
	import IconPause from '~icons/mdi/pause';
	import { RangeSlider } from '@skeletonlabs/skeleton';

	$: thumbUrl = $playingNow
		? makeThumbnailUrl($address, $token, $playingNow.track.thumbnail_id)
		: null;
	$: audioUrl = $playingNow ? makeAudioUrl($address, $token, $playingNow.id) : null;

	function getAudioElement() {
		return document.getElementById('audio-source')! as HTMLAudioElement;
	}

	function calculateMinuteSecond(seconds: number) {
		let secs = Math.floor(seconds);
		let secsLeftover = secs % 60;
		let minutes = (secs - secsLeftover) / 60;

		let secondsFormatted = secsLeftover < 10 ? `0${secsLeftover}` : `${secsLeftover}`;
		let minutesFormatted = minutes < 10 ? `0${minutes}` : `${minutes}`;

		return `${minutesFormatted}:${secondsFormatted}`;
	}

	let isPaused = false;
	let currentTime = 0;
	let duration = 0;

	let isError = false;
	let showIcon = false;
</script>

{#if $playingNow !== null}
	<div class="flex gap-2">
		<audio
			id="audio-source"
			src={audioUrl}
			bind:paused={isPaused}
			bind:currentTime
			bind:duration
			autoplay
		/>
		<button
			class="z-10 relative placeholder w-12 h-12"
			on:pointerenter={(_) => (showIcon = true)}
			on:pointerleave={(_) => (showIcon = false)}
			on:click={(_) => {
				let elem = getAudioElement();
				if (isPaused) {
					elem.play();
				} else {
					elem.pause();
				}
			}}
		>
			<!-- svelte-ignore a11y-missing-attribute -->
			<img
				src={thumbUrl}
				class="child {isError ? 'hidden' : ''}"
				on:error={() => (isError = true)}
				on:load={() => (isError = false)}
			/>
			<IconPlay class="child play-icon {showIcon && isPaused ? 'visible' : 'hidden'}" />
			<IconPause class="child play-icon {showIcon && !isPaused ? 'visible' : 'hidden'}" />
		</button>
		<div class="flex flex-col gap-1">
			<div
				title={$playingNow.track.title}
				class="w-80 max-md:w-44 max-sm:w-32 whitespace-nowrap overflow-ellipsis overflow-hidden"
			>
				{$playingNow.track.title}
			</div>
			<div class="flex items-center gap-1">
				<RangeSlider
					name="progress"
					bind:value={currentTime}
					max={duration}
					step={0.01}
					class="w-72 max-md:w-36 max-sm:w-24"
				/>
				<div class="text-xs opacity-70 w-8">{calculateMinuteSecond(currentTime)}</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	:global(.play-icon) {
		@apply variant-glass-surface backdrop-blur-sm;
	}
	:global(.child) {
		@apply absolute top-0 left-0 w-12 h-12;
	}
	:global(.range-content) {
		@apply p-0;
	}
</style>
