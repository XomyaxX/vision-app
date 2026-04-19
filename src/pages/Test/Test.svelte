<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Question, Test } from '$types/test';

	type Props = {
		questions: Question[];
		test?: Test;
	};

	let { questions, test }: Props = $props();

	let score = $state<number>(0);
	let current = $state<number>(0);
	let finished = $state<boolean>(false);
	let answer = $state<string>('');

	function check(e: Event) {
		e.preventDefault();
		const pointPerQuestion = 100 / questions.length;
		if (answer.trim() === questions[current].answer.trim()) score += pointPerQuestion;

		answer = '';
		if (current < questions.length - 1) current++;
		else finished = true;
	}
</script>

<article style="max-width: 600px; margin: 0 auto; text-align: center;">
	<h2>{test?.title}</h2>

	{#if questions.length === 0}
		<p>В этом тесте пока нет вопросов.</p>
		<a href="/test" role="button" class="secondary">Назад</a>
	{:else if !finished}
		<div style="min-height: 300px; margin-bottom: 20px;">
			{#if questions[current].question_text}
				<h3 style="margin-bottom: 15px;">{questions[current].question_text}</h3>
			{/if}
			{#if questions[current].image_url}
				<img
					src={questions[current].image_url}
					alt="test"
					style="border-radius: 10px; max-width: 250px; margin: 0 auto 20px auto; display: block;"
				/>
			{/if}

			<form onsubmit={check}>
				<input type="text" bind:value={answer} placeholder="Ваш ответ" required />
				<button type="submit">Ответить</button>
			</form>
		</div>
		<small>Вопрос {current + 1} из {questions.length}</small>
	{:else}
		<h3>Тест завершен! Точность: {Math.round(score)}%</h3>
		<form method="POST" action="?/save" use:enhance>
			<input type="hidden" name="score" value={Math.round(score)} />
			<button type="submit" class="contrast">Сохранить результат</button>
		</form>
	{/if}
</article>
