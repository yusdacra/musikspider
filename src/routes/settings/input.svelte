<script lang="ts">
	export let store: any;
	export let name: string;
	export let type = 'text';
</script>

<label class="label grid grid-cols-2 items-center gap-3">
	<span class="badge variant-filled w-min text-sm">{name}</span>
	<input
		class="input"
		value={$store}
		{name}
		{type}
		on:change={(ev) => store.set(ev.currentTarget.value)}
	/>
</label>
