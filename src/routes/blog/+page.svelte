<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Posts from '$pages/Posts/Posts.svelte';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Статьи</title>
</svelte:head>

<Posts posts={data.posts} />
