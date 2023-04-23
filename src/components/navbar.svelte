<script>
	import Link from './a.svelte';
	import IconMusic from '~icons/mdi/music';
	import IconSettings from '~icons/mdi/settings';
	import IconArtist from '~icons/mdi/artist';
	import IconAlbum from '~icons/mdi/album';
</script>

<nav class="flex">
	<Link href="/"><IconMusic class="w-7 h-7" /></Link>
	<Link href="/albums"><IconAlbum class="w-7 h-7" /></Link>
	<Link href="/artists"><IconArtist class="w-7 h-7" /></Link>
	<Link href="/settings"><IconSettings class="w-7 h-7" /></Link>
</nav>
