<script lang="ts">
	import type { Question } from '$types/test';

	type Props = {
		question: Question;
		onAnswer: (answer: string, isCorrect: boolean) => void;
		questionNumber: number;
		totalQuestions: number;
	};

	let { question, onAnswer }: Props = $props();

	let redText = $state('ОЧКИ');
	let greenText = $state('ОЧКИ');

	try {
		if (question.options) {
			const parsed = JSON.parse(question.options);
			if (parsed.red_text) redText = parsed.red_text;
			if (parsed.green_text) greenText = parsed.green_text;
		}
	} catch {
		// defaults
	}

	const choices = [
		{ label: 'Красный фон чётче', value: 'red' },
		{ label: 'Зелёный фон чётче', value: 'green' },
		{ label: 'Одинаково', value: 'same' }
	];

	function choose(value: string) {
		const correct = value === question.answer;
		onAnswer(value, correct);
	}
</script>

<div class="test-stage">
	{#if question.question_text}
		<h3 class="test-prompt">{question.question_text}</h3>
	{/if}

	<div class="duochrome-panels">
		<div class="panel red-panel">
			<span class="panel-text">{redText}</span>
		</div>
		<div class="panel green-panel">
			<span class="panel-text">{greenText}</span>
		</div>
	</div>

	<div class="mcq-grid">
		{#each choices as c}
			<button class="mcq-btn" onclick={() => choose(c.value)} type="button">
				{c.label}
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
	.test-prompt {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		text-align: center;
	}
	.duochrome-panels {
		display: flex;
		width: 100%;
		max-width: 500px;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
	}
	.panel {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		min-height: 180px;
	}
	.red-panel {
		background: #dc2626;
	}
	.green-panel {
		background: #16a34a;
	}
	.panel-text {
		font-size: 2.5rem;
		font-weight: 700;
		color: white;
		letter-spacing: 0.15em;
		text-shadow: 0 1px 3px rgba(0,0,0,0.3);
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
