<script lang="ts">
	import type { Question } from '$types/test';

	type Props = {
		question: Question;
		onAnswer: (answer: string, isCorrect: boolean) => void;
		questionNumber: number;
		totalQuestions: number;
	};

	let { question, onAnswer, questionNumber, totalQuestions }: Props = $props();

	let answer = $state('');

	function submit(e: Event) {
		e.preventDefault();
		const correct = answer.trim().toLowerCase() === question.answer.trim().toLowerCase();
		onAnswer(answer, correct);
		answer = '';
	}
</script>

<div class="test-stage">
	{#if question.image_url}
		<img src={question.image_url} alt="test" class="test-image" />
	{/if}
	{#if question.question_text}
		<h3 class="test-prompt">{question.question_text}</h3>
	{/if}

	<form onsubmit={submit} class="test-form">
		<input
			type="text"
			bind:value={answer}
			placeholder="Ваш ответ"
			required
			class="test-input"
			autocomplete="off"
		/>
		<button type="submit" class="test-btn primary">Ответить</button>
	</form>
</div>

<style>
	.test-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}
	.test-image {
		border-radius: 12px;
		max-width: 300px;
		max-height: 300px;
		object-fit: contain;
	}
	.test-prompt {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		text-align: center;
	}
	.test-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		max-width: 320px;
	}
	.test-input {
		font-size: 1.25rem;
		padding: 0.75rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		text-align: center;
		transition: border-color 0.2s;
	}
	.test-input:focus {
		outline: none;
		border-color: #2563eb;
	}
	.test-btn {
		font-size: 1.1rem;
		padding: 0.75rem 1.5rem;
		border-radius: 10px;
		border: none;
		cursor: pointer;
		transition: transform 0.1s, opacity 0.2s;
	}
	.test-btn.primary {
		background: #2563eb;
		color: white;
	}
	.test-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}
	.test-btn:active {
		transform: translateY(0);
	}
</style>
