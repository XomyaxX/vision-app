<script lang="ts">
	import { route } from '$constants/routes';
	import type { Post } from '$types/post';

	type Props = {
		posts: Post[];
	};

	let { posts }: Props = $props();
</script>

<h1>Блог о здоровье глаз</h1>

{#each posts as post (post.id)}
	<article>
		<h2>{post.title}</h2>
		<a href={route('/blog/[id]', post.id)} role="button" class="outline">Читать статью</a>
	</article>
{/each}
