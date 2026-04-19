<script lang="ts">
	import { route } from '$constants/routes';
	import type { Post } from '$types/post';
	import { marked } from 'marked';

	type Props = {
		post: Post;
	};

	let { post }: Props = $props();
</script>

<article>
	<h1>{post.title}</h1>
	<div>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html marked(post.content)}
	</div>
	<a href={route('/blog')}>← Назад к статьям</a>
</article>
