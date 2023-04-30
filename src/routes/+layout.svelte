<script lang="ts">
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.css';

	import { AppShell, Toast, toastStore } from '@skeletonlabs/skeleton';
	import {
		address,
		changeLoop,
		currentTrack,
		getAudioElement,
		muted,
		paused,
		queuePosition,
		token,
		tracks,
		tracksSorted
	} from '../stores';
	import { _metadataComm as comm } from './+layout';
	import Navbar from '../components/navbar.svelte';
	import PlayingNow from '../components/playingnow.svelte';
	import VolumeSlider from '../components/volumeSlider.svelte';
	import TrackControls from '../components/trackControls.svelte';

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
	});
</script>

<svelte:window
	on:keydown={(event) => {
		const tagName = document.activeElement?.tagName ?? '';
		const actions = new Map([
			['Space', () => ($paused = !$paused)],
			['KeyL', changeLoop],
			['KeyM', () => ($muted = !$muted)],
			['KeyS', () => document.getElementById('search-input')?.focus()],
			[
				'ArrowLeft',
				() => {
					const audio = getAudioElement();
					if (audio !== null) {
						audio.currentTime -= 5;
					}
				}
			],
			[
				'ArrowRight',
				() => {
					const audio = getAudioElement();
					if (audio !== null) {
						audio.currentTime += 5;
					}
				}
			]
		]);
		if (tagName !== 'INPUT' && actions.has(event.code)) {
			event.preventDefault();
			event.stopPropagation();
			const action = actions.get(event.code) ?? null;
			if (action !== null) {
				action();
			}
		}
	}}
/>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<AppShell>
	<svelte:fragment slot="footer">
		<div class="flex w-screen place-content-end max-sm:place-content-center">
			<div class="card fixed bottom-14 sm:mr-4"><Navbar /></div>
		</div>
		<div class="card rounded-none w-screen flex flex-grow items-center h-12">
			<PlayingNow />
			<div class="flex items-center ml-auto">
				<TrackControls />
				<VolumeSlider />
			</div>
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
<Toast position="tr" />
