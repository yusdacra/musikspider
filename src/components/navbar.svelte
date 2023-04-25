<script>
	import Link from './a.svelte';
	import IconMusic from '~icons/mdi/music';
	import IconSettings from '~icons/mdi/settings';
	import IconArtist from '~icons/mdi/artist';
	import IconAlbum from '~icons/mdi/album';
	import IconPlaylist from '~icons/mdi/playlist-music';
</script>

<nav class="flex">
	<Link title="tracks" href="/"><IconMusic class="w-7 h-7" /></Link>
	<Link title="albums" href="/albums"><IconAlbum class="w-7 h-7" /></Link>
	<Link title="artists" href="/artists"><IconArtist class="w-7 h-7" /></Link>
	<Link title="settings" href="/settings"><IconSettings class="w-7 h-7" /></Link>
</nav>
