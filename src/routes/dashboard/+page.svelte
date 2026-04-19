<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Dashboard from '$pages/Dashboard/Dashboard.svelte';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Дашбоард</title>
</svelte:head>

<Dashboard {...data} />
