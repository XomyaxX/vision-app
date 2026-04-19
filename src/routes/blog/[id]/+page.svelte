<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import Post from '$pages/Post/Post.svelte';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Статья {data.post?.title ?? ''}</title>
</svelte:head>

<Post post={data.post!} />
