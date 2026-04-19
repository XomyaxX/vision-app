<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Register from '$pages/auth/Register/Register.svelte';
	import type { ActionData } from './$types';

	type Props = {
		form: ActionData;
	};

	let { form }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Регистрация</title>
</svelte:head>

<Register {form} />
