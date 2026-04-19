<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Test from '$pages/Test/Test.svelte';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Тест {data.test?.title ?? ''}</title>
</svelte:head>

<Test questions={data.questions} test={data.test} />
