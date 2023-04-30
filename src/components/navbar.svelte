<script lang="ts">
	import Link from './a.svelte';
	import IconSearch from '~icons/mdi/search';
	import IconSettings from '~icons/mdi/settings';
	import IconQueue from '~icons/mdi/playlist-music';
	import { page } from '$app/stores';
	import { search, searchText, setQueuePositionTo, tracksSorted } from '../stores';

	let links: { id: string; href?: string; icon: any }[] = [
		{ id: 'search', href: '/', icon: IconSearch },
		{ id: 'queue', icon: IconQueue },
		{ id: 'settings', icon: IconSettings }
	];
</script>

<nav class="flex">
	{#each links as link}
		<Link title={link.id} href={link.href ?? `/${link.id}`}>
			<svelte:component this={link.icon} class="w-7 h-7" />
		</Link>
		{#if link.id === 'search' && $page.route.id === '/'}
			<input
				id="search-input"
				class="input rounded-none"
				bind:value={$searchText}
				on:input={(ev) => search(ev.currentTarget.value)}
				on:keydown={(ev) => {
					if (ev.key === 'Enter') {
						const track_id = $tracksSorted.at(0) ?? null;
						if (track_id !== null) {
							setQueuePositionTo(track_id);
							document.getElementById(`track-${track_id}`)?.focus();
						}
					}
				}}
			/>
		{/if}
	{/each}
</nav>
