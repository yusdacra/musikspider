<script>
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-vintage.css';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.css';

	import { AppShell, Toast, toastStore } from '@skeletonlabs/skeleton';
	import { address, playingNow, token, tracks, tracksSorted } from '../stores';
	import { _metadataComm as comm } from './+layout';
	import Navbar from '../components/navbar.svelte';
	import PlayingNow from '../components/playingnow.svelte';

	comm.setCallbacks({
		onConnect: () => {
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
			playingNow.set(null);
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
				ts.forEach((t, index) => map.set(index + offset, t.id));
				return map;
			});
			remaining -= 500;
		}
	});

	$: title = $playingNow !== null ? `${$playingNow.track.title} - musikspider` : `musikspider`;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<AppShell>
	<svelte:fragment slot="footer">
		<div class="w-screen">
			<div class="card fixed z-[1] mr-4 bottom-14 right-0"><Navbar /></div>
			<div class="card rounded-none fixed z-[1] w-full bottom-0 flex items-center h-12">
				<PlayingNow />
				<div class="ml-auto">volume</div>
			</div>
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
<Toast position="tr" />
