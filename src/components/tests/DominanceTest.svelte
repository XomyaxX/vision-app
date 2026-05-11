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

	try {
		if (question.options) {
			const parsed = JSON.parse(question.options);
			if (parsed.choices && Array.isArray(parsed.choices)) {
				options = parsed.choices;
			}
		}
	} catch {
		options = ['Левый глаз', 'Правый глаз'];
	}

	function choose(value: string) {
		const correct = value === question.answer;
		onAnswer(value, correct);
	}
</script>

<div class="test-stage">
	<div class="instruction-card">
        <h3>🔍 Инструкция</h3>
        <ol>
            <li>Вытяните руку на расстояние вытянутой руки от лица.</li>
            <li>Сделайте маленькое отверстие между большим и указательным пальцами.</li>
            <li>Направьте отверстие на удалённый объект (окно, лампу).</li>
            <li>Закройте левый глаз — если объект остался в центре, ведущий <strong>правый</strong> глаз.</li>
            <li>Закройте правый глаз — если объект остался в центре, ведущий <strong>левый</strong> глаз.</li>
        </ol>
    </div>

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
    .instruction-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        max-width: 480px;
        width: 100%;
    }
    .instruction-card h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1.1rem;
    }
    .instruction-card ol {
        margin: 0;
        padding-left: 1.25rem;
        font-size: 0.95rem;
        line-height: 1.6;
        color: #475569;
    }
    .instruction-card li {
        margin-bottom: 0.4rem;
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
