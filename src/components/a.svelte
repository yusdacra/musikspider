<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	export let title: string = '';
	let targetId = href === '/' ? '/(app)' : `/(app)${href}`;

	$: isOnPage = targetId === $page.route.id;
</script>

<a
	{href}
	{title}
	class="btn py-2 px-2.5 {isOnPage
		? `${title === 'search' ? 'rounded-r-none' : ''} variant-ghost-primary`
		: 'hover:variant-soft-primary'}"
>
	<slot />
</a>
