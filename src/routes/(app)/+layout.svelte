<script lang="ts">
	import '../../app.postcss';

	import { AppShell, Toast, getToastStore, initializeStores } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
	import {
		address,
		changeLoop,
		currentTrack,
		muted,
		paused,
		queuePosition,
		token,
		tracks,
		tracksSorted
	} from '../../stores';
	import { _metadataComm as comm } from './+layout';
	import Navbar from '../../components/navbar.svelte';
	import PlayingNow from '../../components/playingnow.svelte';
	import VolumeSlider from '../../components/volumeSlider.svelte';
	import LoopButton from '../../components/loopButton.svelte';
	import { getAudioElement, interceptKeys } from '../../utils';

	initializeStores();
	const toastStore = getToastStore();

	$: title = $currentTrack !== null ? `${$currentTrack.track.title} - musikspider` : `musikspider`;

	comm.setCallbacks({
		onConnect: () => {
			toastStore.clear();
			toastStore.trigger({
				message: 'Successfully connected to the server',
				background: 'variant-filled-success'
			});
		},
		onDisconnect: (authenticated, reason) => {
			const errorMessage = authenticated ? 'Disconnected' : 'Error while connecting to the server';
			toastStore.trigger({
				message: `${errorMessage}: ${reason}`,
				background: 'variant-filled-error',
				autohide: false
			});
			queuePosition.set(null);
		},
		onIncompatible: (reason) => {
			toastStore.trigger({
				message: `Possible incompatible environment: ${reason}`,
				background: 'variant-filled-warning',
				autohide: false
			});
		}
	});
	comm.connect($address, $token);
	comm.onConnect(async () => {
		toastStore.trigger({
			message: 'Fetching tracks',
			background: 'variant-filled-tertiary'
		});
		const count = await comm.fetchTracksCount();

		let remaining = count;
		while (remaining > 0) {
			const offset = count - remaining;
			const ts = await comm.fetchTracks(500, offset);
			tracks.update((map) => {
				ts.forEach((t) => map.set(t.id, t.track));
				return map;
			});
			tracksSorted.update((map) => {
				ts.forEach((t) => map.push(t.id));
				return map;
			});
			remaining -= 500;
		}

		toastStore.trigger({
			message: `Fetched ${count} tracks`,
			background: 'variant-filled-success'
		});

		comm.close();
	});
</script>

<svelte:window
	on:keydown={interceptKeys([
		['KeyS', () => document.getElementById('search-input')?.focus()],
		['KeyL', changeLoop]
	])}
/>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<Toast position="tr" />
<AppShell>
	<svelte:fragment slot="footer">
		<div class="flex w-screen place-content-end max-sm:place-content-center">
			<div class="card fixed bottom-14 sm:mr-4"><Navbar /></div>
		</div>
		<div class="card rounded-none w-screen flex flex-grow items-center h-12">
			<PlayingNow />
			<div class="flex items-center ml-auto">
				<LoopButton />
				<VolumeSlider />
			</div>
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
