<script>
	import { token, address } from '../../stores';
	import Input from './input.svelte';
	import { _metadataComm as comm } from '../+layout';

	$: reconnect = () => comm.connect($address, $token);
</script>

<div class="flex flex-col gap-4 m-8 max-md:m-2">
	<div class="card grid gap-1 p-4 max-w-md">
		<h3>server settings</h3>
		<Input store={address} name="address" />
		<Input store={token} name="token" type="password" />
		<button class="btn variant-filled hover:variant-filled-primary w-min" on:click={reconnect}
			>connect</button
		>
	</div>
</div>
