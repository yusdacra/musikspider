<script lang="ts">
	import Link from './a.svelte';
	import IconTrack from '~icons/mdi/music-box';
	import IconSettings from '~icons/mdi/settings';
	import IconArtist from '~icons/mdi/artist';
	import IconAlbum from '~icons/mdi/album';
	import IconPlaylist from '~icons/mdi/playlist-music';
	import IconQueue from '~icons/mdi/format-list-bulleted';

	let links: { id: string; href?: string; icon: any }[] = [
		{ id: 'queue', icon: IconQueue },
		{ id: 'tracks', href: '/', icon: IconTrack },
		{ id: 'albums', icon: IconAlbum },
		{ id: 'artists', icon: IconArtist },
		{ id: 'playlists', icon: IconPlaylist },
		{ id: 'settings', icon: IconSettings }
	];
</script>

<nav class="flex">
	{#each links as link}
		<Link title={link.id} href={link.href ?? `/${link.id}`}>
			<svelte:component this={link.icon} class="w-7 h-7" />
		</Link>
	{/each}
</nav>
