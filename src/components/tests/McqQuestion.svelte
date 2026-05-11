<script lang="ts">
	import type { Question } from '$types/test';

	type Props = {
		question: Question;
		onAnswer: (answer: string, isCorrect: boolean) => void;
		questionNumber: number;
		totalQuestions: number;
	};

	let { question, onAnswer }: Props = $props();

	let options = $state<string[]>([]);
	let selected = $state<string | null>(null);

	try {
		if (question.options) {
			const parsed = JSON.parse(question.options);
			if (parsed.choices && Array.isArray(parsed.choices)) {
				options = parsed.choices;
			} else if (Array.isArray(parsed)) {
				options = parsed;
			}
		}
	} catch {
		options = [];
	}

	function choose(value: string) {
		selected = value;
		const correct = value === question.answer;
		onAnswer(value, correct);
		selected = null;
	}
</script>

<div class="test-stage">
	{#if question.image_url}
		<img src={question.image_url} alt="test" class="test-image" />
	{/if}
	{#if question.question_text}
		<h3 class="test-prompt">{question.question_text}</h3>
	{/if}

	<div class="mcq-grid">
		{#each options as opt}
			<button class="mcq-btn" onclick={() => choose(opt)} type="button">
				{opt}
			</button>
		{/each}
	</div>
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
	.mcq-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
		width: 100%;
		max-width: 400px;
	}
	.mcq-btn {
		font-size: 1.1rem;
		padding: 1rem 1.25rem;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		background: white;
		cursor: pointer;
		text-align: center;
		transition: all 0.15s;
	}
	.mcq-btn:hover {
		border-color: #2563eb;
		background: #eff6ff;
		transform: translateY(-2px);
	}
	.mcq-btn:active {
		transform: translateY(0);
		background: #dbeafe;
	}
</style>
