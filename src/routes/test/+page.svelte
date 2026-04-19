<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Tests from '$pages/Tests/Tests.svelte';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Тесты</title>
</svelte:head>

<Tests tests={data.tests} />
