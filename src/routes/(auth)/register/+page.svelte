<script lang="ts">
	import Register from '$pages/auth/Register/Register.svelte';
	import type { ActionData } from './$types';

	type Props = {
		form: ActionData;
	};

	let { form }: Props = $props();
</script>

<Register {form} />
