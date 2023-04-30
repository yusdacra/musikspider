<script lang="ts">
	import IconRepeat from '~icons/mdi/repeat';
	import IconRepeatOff from '~icons/mdi/repeat-off';
	import IconRepeatOnce from '~icons/mdi/repeat-once';
	import { loop } from '../stores';
	import { LoopKind } from '../types';

	function getIcon(kind: LoopKind) {
		switch (kind) {
			case LoopKind.Always:
				return IconRepeat;
			case LoopKind.Off:
				return IconRepeatOff;
			case LoopKind.Once:
				return IconRepeatOnce;
		}
	}

	function changeLoop() {
		switch ($loop) {
			case LoopKind.Always:
				loop.set(LoopKind.Off);
				break;
			case LoopKind.Off:
				loop.set(LoopKind.Once);
				break;
			case LoopKind.Once:
				loop.set(LoopKind.Always);
				break;
		}
	}

	function loopKindToString(kind: LoopKind) {
		switch (kind) {
			case LoopKind.Off:
				return 'repeat off';
			case LoopKind.Once:
				return 'repeat playlist';
			case LoopKind.Always:
				return 'repeat song';
		}
	}

	$: icon = getIcon($loop);
	$: title = loopKindToString($loop);
</script>

<button {title} on:click={changeLoop}>
	<svelte:component this={icon} class="w-7 h-7" />
</button>
