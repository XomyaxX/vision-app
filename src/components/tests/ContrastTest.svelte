<script lang="ts">
	import type { Question } from '$types/test';

	type Props = {
		question: Question;
		onComplete: (result: { score: number; details: Record<string, unknown>; message: string }) => void;
	};

	let { question, onComplete }: Props = $props();

	let config = $state({
		letters: 'CDEFHKLNPRUVWXYZ',
		levels: [100, 50, 25, 12, 6, 3]
	});
	try {
		if (question.options) {
			config = { ...config, ...JSON.parse(question.options) };
		}
	} catch {
		// defaults
	}

	let levelIndex = $state(0);
	let currentLetter = $state('');
	let answer = $state('');
	let correctCount = $state(0);
	let consecutiveErrors = $state(0);
	let finished = $state(false);

	function pickLetter() {
		const pool = config.letters.split('');
		currentLetter = pool[Math.floor(Math.random() * pool.length)];
		answer = '';
	}

	pickLetter();

	let currentLevel = $derived(config.levels[levelIndex] ?? 3);
	let contrastStyle = $derived(`
		opacity: ${Math.max(0.15, currentLevel / 100)};
		filter: contrast(${currentLevel}%);
	`);

	function check(e?: Event) {
		if (e) e.preventDefault();
		if (!answer) return;

		const correct = answer.trim().toUpperCase() === currentLetter;
		if (correct) {
			correctCount++;
			consecutiveErrors = 0;
			levelIndex++;
			if (levelIndex >= config.levels.length) {
				finishTest(true);
				return;
			}
		} else {
			consecutiveErrors++;
			if (consecutiveErrors >= 2) {
				finishTest(false);
				return;
			}
		}
		pickLetter();
	}

	function finishTest(completedAll: boolean) {
		finished = true;
		const bestLevel = completedAll
			? config.levels[config.levels.length - 1]
			: config.levels[Math.max(0, levelIndex - 1)] ?? 100;
		const score = Math.max(5, Math.round(((100 - bestLevel) / 97) * 100));

		const message =
			bestLevel <= 6
				? 'Отличная контрастная чувствительность. Вы различаете очень тонкие градации.'
				: bestLevel <= 25
					? 'Хорошая контрастная чувствительность.'
					: bestLevel <= 50
						? 'Средняя контрастная чувствительность.'
						: 'Контрастная чувствительность снижена. Рекомендуется обследование.';

		onComplete({
			score,
			details: { best_level: bestLevel, total_correct: correctCount },
			message
		});
	}
</script>

<div class="contrast-stage">
	{#if !finished}
		<div class="contrast-letter" style={contrastStyle}>
			{currentLetter}
		</div>

		<form onsubmit={check} class="test-form">
			<input
				type="text"
				bind:value={answer}
				placeholder="Введите букву"
				maxlength="1"
				required
				class="test-input"
				autocomplete="off"
			/>
			<button type="submit" class="test-btn primary">Ответить</button>
		</form>

		<div class="contrast-meta">
			<span>Контраст: {currentLevel}%</span>
			<span>Уровень {levelIndex + 1} из {config.levels.length}</span>
			{#if consecutiveErrors > 0}<span class="error">Ошибка!</span>{/if}
		</div>

		<div class="contrast-bar">
			{#each config.levels as lvl, i}
				<div class="bar-segment" class:active={i <= levelIndex} class:current={i === levelIndex}>
					{lvl}%
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.contrast-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem;
	}
	.contrast-letter {
		font-size: 8rem;
		font-weight: 800;
		color: #111827;
		font-family: system-ui, sans-serif;
		width: 200px;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f9fafb;
		border-radius: 16px;
		user-select: none;
		transition: opacity 0.3s, filter 0.3s;
	}
	.test-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		max-width: 280px;
	}
	.test-input {
		font-size: 1.25rem;
		padding: 0.75rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		text-align: center;
		text-transform: uppercase;
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
		transition: all 0.15s;
		background: #2563eb;
		color: white;
	}
	.test-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}
	.contrast-meta {
		display: flex;
		gap: 1.5rem;
		font-size: 0.9rem;
		color: #6b7280;
		flex-wrap: wrap;
		justify-content: center;
	}
	.contrast-meta .error {
		color: #dc2626;
		font-weight: 600;
	}
	.contrast-bar {
		display: flex;
		gap: 4px;
		width: 100%;
		max-width: 400px;
		justify-content: center;
	}
	.bar-segment {
		flex: 1;
		padding: 0.5rem 0.25rem;
		border-radius: 6px;
		background: #e5e7eb;
		font-size: 0.75rem;
		text-align: center;
		color: #9ca3af;
		transition: all 0.3s;
	}
	.bar-segment.active {
		background: #bfdbfe;
		color: #1e40af;
	}
	.bar-segment.current {
		background: #2563eb;
		color: white;
		font-weight: 600;
	}
</style>
