<script lang="ts">
	import { route } from '$constants/routes';
	import type { Test } from '$types/test';

	type Props = {
		tests: Test[];
	};

	let { tests }: Props = $props();
</script>

<h1>Доступные тесты</h1>
<div class="grid">
	{#each tests as test (test.id)}
		<article>
			<h3>{test.title}</h3>
			<p style="color: var(--pico-muted-color);">{test.description}</p>
			<a href={route('/test/[id]', String(test.id))} role="button">Начать тест</a>
		</article>
	{/each}
</div>
