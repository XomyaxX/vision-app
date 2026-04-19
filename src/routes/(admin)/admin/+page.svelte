<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Admin from '$pages/Admin/Admin.svelte';
	import type { ActionData, PageData } from './$types';

	type Props = {
		data: PageData;
		form: ActionData;
	};

	let { data, form }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Админка</title>
</svelte:head>

<Admin {...data} {form} />
