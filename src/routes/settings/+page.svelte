<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Settings from '$pages/Settings/Settings.svelte';
	import type { ActionData } from './$types';

	type Props = {
		form: ActionData;
	};

	let { form }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Настройки</title>
</svelte:head>

<Settings {form} />
