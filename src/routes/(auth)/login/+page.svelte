<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Login from '$pages/auth/Login/Login.svelte';
	import type { ActionData } from './$types';

	type Props = {
		form: ActionData;
	};

	let { form }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Вход</title>
</svelte:head>

<Login {form} />
