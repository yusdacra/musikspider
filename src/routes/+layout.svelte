<script>
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-vintage.css';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.css';

	import { AppShell, Toast, toastStore } from '@skeletonlabs/skeleton';
	import Navbar from '../components/navbar.svelte';
	import { address, token, tracks, tracksSorted } from '../stores';
	import { _metadataComm as comm } from './+layout';

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
	comm.onConnect(() => {
		comm
			.fetchTracksCount()
			.then((count) => {
				let remaining = count;
				console.log(count);
				while (remaining > 0) {
					const offset = count - remaining;
					comm.fetchTracks(500, offset).then((ts) => {
						tracks.update((map) => {
							ts.forEach((t) => map.set(t.id, t.track));
							return map;
						});
						tracksSorted.update((map) => {
							ts.forEach((t, index) => map.set(index + offset, t.id));
							return map;
						});
					});
					remaining -= 500;
				}
			})
			.catch(() => null);
	});
</script>

<svelte:head>
	<title>musikspider</title>
</svelte:head>

<AppShell>
	<svelte:fragment slot="footer">
		<div class="flex w-screen place-content-center">
			<div class="card m-2 sm:hidden z-1 fixed bottom-[48px]"><Navbar /></div>
		</div>
		<div class="flex flex-col">
			<div class="card m-2 max-md:m-0 px-4 flex flex-1 items-center min-h-[48px]">
				now playing
				<div class="mx-auto max-sm:hidden"><Navbar /></div>
				<div class="max-sm:ml-auto">volume</div>
			</div>
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
<Toast />
