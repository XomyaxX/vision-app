<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Question, Test } from '$types/test';
	import TextQuestion from './TextQuestion.svelte';
	import McqQuestion from './McqQuestion.svelte';
	import SnellenTest from './SnellenTest.svelte';
	import LandoltCTest from './LandoltCTest.svelte';
	import IshiharaPlate from './IshiharaPlate.svelte';
	import AstigmatismWheel from './AstigmatismWheel.svelte';
	import ContrastTest from './ContrastTest.svelte';
	import AmslerGrid from './AmslerGrid.svelte';
	import DuochromeTest from './DuochromeTest.svelte';
	import DominanceTest from './DominanceTest.svelte';

	type Props = {
		questions: Question[];
		test?: Test;
	};

	let { questions, test }: Props = $props();

	let phase = $state<'intro' | 'running' | 'results'>('intro');
	let score = $state(0);
	let details = $state<Record<string, unknown> | null>(null);
	let resultMessage = $state('');

	// Procedural test types handled by dedicated components
	const proceduralTypes = ['snellen', 'landolt', 'ishihara', 'astigmatism', 'contrast'];
	const isProcedural = questions.length === 1 && proceduralTypes.includes(questions[0].type ?? 'text');

	// For sequential question-based tests
	let currentQ = $state(0);
	let correctCount = $state(0);
	let totalAnswered = $state(0);

	function startTest() {
		phase = 'running';
		currentQ = 0;
		correctCount = 0;
		totalAnswered = 0;
		score = 0;
		details = null;
		resultMessage = '';
	}

	function handleQuestionAnswer(_answer: string, isCorrect: boolean) {
		totalAnswered++;
		if (isCorrect) correctCount++;

		if (currentQ < questions.length - 1) {
			currentQ++;
		} else {
			finishSequentialTest();
		}
	}

	function finishSequentialTest() {
		score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
		let message = '';
		if (score >= 90) {
			message = 'Отличный результат! Показатели в норме.';
		} else if (score >= 70) {
			message = 'Хороший результат. Небольшие отклонения возможны.';
		} else if (score >= 50) {
			message = 'Обнаружены отклонения. Рекомендуется консультация специалиста.';
		} else {
			message = 'Выявлены значительные отклонения. Обратитесь к офтальмологу.';
		}
		resultMessage = message;
		details = { correct: correctCount, total: questions.length };
		phase = 'results';
	}

	function handleProceduralComplete(result: { score: number; details: Record<string, unknown>; message: string }) {
		score = result.score;
		details = result.details;
		resultMessage = result.message;
		phase = 'results';
	}

	function getInterpretationColor() {
		if (score >= 80) return 'green';
		if (score >= 50) return 'yellow';
		return 'red';
	}

	function getProgressPercent() {
		if (isProcedural) return 50; // procedural tests manage their own progress
		if (questions.length === 0) return 0;
		return Math.round((currentQ / questions.length) * 100);
	}

	let currentQuestion = $derived(questions[currentQ]);
</script>

<div class="test-runner">
	{#if phase === 'intro'}
		<div class="intro-screen">
			<div class="intro-icon">👁️</div>
			<h2 class="intro-title">{test?.title}</h2>
			<p class="intro-desc">{test?.description}</p>
			<div class="intro-instructions">
				<h4>Инструкция</h4>
				<ul>
					<li>Проводите тест в хорошо освещённом помещении.</li>
					<li>Если тест проверяет остроту зрения — отойдите на 2–3 метра от экрана.</li>
					<li>Не напрягайте глаза. Если устали — сделайте паузу.</li>
					<li>Результаты тестов — ориентировочные и не заменяют осмотр у врача.</li>
				</ul>
			</div>
			<button class="start-btn" onclick={startTest} type="button">Начать тест</button>
		</div>

	{:else if phase === 'running'}
		<div class="running-screen">
			<div class="progress-track">
				<div class="progress-fill" style="width: {getProgressPercent()}%"></div>
			</div>

			{#if !isProcedural && questions.length > 0}
				<div class="question-counter">
					Вопрос {currentQ + 1} из {questions.length}
				</div>
			{/if}

			{#if isProcedural}
				{@const q = questions[0]}
				{#if q.type === 'snellen'}
					<SnellenTest question={q} onComplete={handleProceduralComplete} />
				{:else if q.type === 'landolt'}
					<LandoltCTest question={q} onComplete={handleProceduralComplete} />
				{:else if q.type === 'ishihara'}
					<IshiharaPlate question={q} onComplete={handleProceduralComplete} />
				{:else if q.type === 'astigmatism'}
					<AstigmatismWheel question={q} onComplete={handleProceduralComplete} />
				{:else if q.type === 'contrast'}
					<ContrastTest question={q} onComplete={handleProceduralComplete} />
				{:else}
					<TextQuestion question={q} onAnswer={handleQuestionAnswer} questionNumber={1} totalQuestions={1} />
				{/if}
			{:else if currentQuestion}
				{#if currentQuestion.type === 'text'}
					<TextQuestion
						question={currentQuestion}
						onAnswer={handleQuestionAnswer}
						questionNumber={currentQ + 1}
						totalQuestions={questions.length}
					/>
				{:else if currentQuestion.type === 'mcq'}
					<McqQuestion
						question={currentQuestion}
						onAnswer={handleQuestionAnswer}
						questionNumber={currentQ + 1}
						totalQuestions={questions.length}
					/>
				{:else if currentQuestion.type === 'amsler'}
					<AmslerGrid
						question={currentQuestion}
						onAnswer={handleQuestionAnswer}
						questionNumber={currentQ + 1}
						totalQuestions={questions.length}
					/>
				{:else if currentQuestion.type === 'duochrome'}
					<DuochromeTest
						question={currentQuestion}
						onAnswer={handleQuestionAnswer}
						questionNumber={currentQ + 1}
						totalQuestions={questions.length}
					/>
				{:else if currentQuestion.type === 'dominance'}
					<DominanceTest
						question={currentQuestion}
						onAnswer={handleQuestionAnswer}
						questionNumber={currentQ + 1}
						totalQuestions={questions.length}
					/>
				{:else}
					<TextQuestion
						question={currentQuestion}
						onAnswer={handleQuestionAnswer}
						questionNumber={currentQ + 1}
						totalQuestions={questions.length}
					/>
				{/if}
			{:else}
				<p>Нет вопросов в этом тесте.</p>
			{/if}
		</div>

	{:else}
		<div class="results-screen">
			<h1 class="results-score">{score}%</h1>

			<div class="results-badge" data-color={getInterpretationColor()}>
				{#if getInterpretationColor() === 'green'}
					✅ В пределах нормы
				{:else if getInterpretationColor() === 'yellow'}
					⚠️ Требует внимания
				{:else}
					🚨 Рекомендуется консультация
				{/if}
			</div>

			<p class="results-message">{resultMessage}</p>

			{#if details}
				<div class="results-details">
					<pre>{JSON.stringify(details, null, 2)}</pre>
				</div>
			{/if}

			<div class="results-actions">
				<form method="POST" action="?/save" use:enhance class="save-form">
					<input type="hidden" name="score" value={score} />
					<input type="hidden" name="details" value={details ? JSON.stringify(details) : ''} />
					<button type="submit" class="save-btn">💾 Сохранить результат</button>
				</form>
				<button class="retry-btn" onclick={startTest} type="button">🔄 Пройти ещё раз</button>
				<a href="/test" class="back-link">← К списку тестов</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.test-runner {
		max-width: 720px;
		margin: 0 auto;
		padding: 1rem;
	}
	.intro-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		text-align: center;
		padding: 2rem 1rem;
	}
	.intro-icon {
		font-size: 4rem;
	}
	.intro-title {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
	}
	.intro-desc {
		font-size: 1.1rem;
		color: #6b7280;
		max-width: 480px;
		margin: 0;
	}
	.intro-instructions {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		max-width: 480px;
		width: 100%;
		text-align: left;
	}
	.intro-instructions h4 {
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
	}
	.intro-instructions ul {
		margin: 0;
		padding-left: 1.25rem;
		font-size: 0.95rem;
		line-height: 1.6;
		color: #475569;
	}
	.intro-instructions li {
		margin-bottom: 0.35rem;
	}
	.start-btn {
		font-size: 1.2rem;
		padding: 1rem 2.5rem;
		border-radius: 12px;
		border: none;
		background: #2563eb;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
		width: 100%;
		max-width: 320px;
	}
	.start-btn:hover {
		background: #1d4ed8;
		transform: translateY(-2px);
	}
	.running-screen {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
		padding: 1rem 0;
	}
	.progress-track {
		width: 100%;
		height: 6px;
		background: #e5e7eb;
		border-radius: 3px;
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		background: #2563eb;
		border-radius: 3px;
		transition: width 0.3s ease;
	}
	.question-counter {
		font-size: 0.9rem;
		color: #6b7280;
		font-weight: 500;
	}
	.results-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		text-align: center;
		padding: 2rem 1rem;
	}
	.results-score {
		font-size: 4rem;
		font-weight: 800;
		margin: 0;
		color: #111827;
		line-height: 1;
	}
	.results-badge {
		font-size: 1.1rem;
		font-weight: 600;
		padding: 0.6rem 1.25rem;
		border-radius: 999px;
	}
	.results-badge[data-color='green'] {
		background: #d1fae5;
		color: #065f46;
	}
	.results-badge[data-color='yellow'] {
		background: #fef3c7;
		color: #92400e;
	}
	.results-badge[data-color='red'] {
		background: #fee2e2;
		color: #991b1b;
	}
	.results-message {
		font-size: 1.1rem;
		color: #374151;
		max-width: 480px;
		margin: 0;
		line-height: 1.5;
	}
	.results-details {
		background: #f3f4f6;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		max-width: 400px;
		width: 100%;
	}
	.results-details pre {
		margin: 0;
		font-size: 0.8rem;
		color: #4b5563;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.results-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		max-width: 320px;
		margin-top: 0.5rem;
	}
	.save-form {
		margin: 0;
	}
	.save-btn {
		font-size: 1.1rem;
		padding: 0.9rem 1.5rem;
		border-radius: 10px;
		border: none;
		background: #2563eb;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
		width: 100%;
	}
	.save-btn:hover {
		background: #1d4ed8;
		transform: translateY(-1px);
	}
	.retry-btn {
		font-size: 1rem;
		padding: 0.75rem 1.5rem;
		border-radius: 10px;
		border: 2px solid #e5e7eb;
		background: white;
		color: #374151;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
		width: 100%;
	}
	.retry-btn:hover {
		border-color: #9ca3af;
		background: #f9fafb;
	}
	.back-link {
		font-size: 0.95rem;
		color: #6b7280;
		text-decoration: none;
		padding: 0.5rem;
		transition: color 0.15s;
	}
	.back-link:hover {
		color: #2563eb;
	}
</style>
