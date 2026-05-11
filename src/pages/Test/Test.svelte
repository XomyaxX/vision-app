<script lang="ts">
	import { SITE_NAME } from '$constants/common';
	import TestRunner from '$components/tests/TestRunner.svelte';
	import type { Question, Test } from '$types/test';

	type Props = {
		questions: Question[];
		test?: Test;
	};

	let { questions, test }: Props = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — Тест {test?.title ?? ''}</title>
</svelte:head>

<TestRunner {questions} {test} />
