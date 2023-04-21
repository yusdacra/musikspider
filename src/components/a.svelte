<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;

	$: isOnPage = href === $page.route.id;
</script>

<a {href} class="btn {isOnPage ? 'variant-ghost-primary' : 'hover:variant-soft-primary'}">
	<slot />
</a>
