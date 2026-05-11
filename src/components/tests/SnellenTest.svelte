<script lang="ts">
	import type { Question } from '$types/test';

	type Props = {
		question: Question;
		onComplete: (result: { score: number; details: Record<string, unknown>; message: string }) => void;
	};

	let { question, onComplete }: Props = $props();

	let config = $state({
		letters: 'CDEFHKLNPRUVWXYZ',
		sizes: [160, 120, 100, 80, 60, 50, 40, 30, 20],
		letters_per_size: 2
	});

	try {
		if (question.options) {
			config = { ...config, ...JSON.parse(question.options) };
		}
	} catch {
		// use defaults
	}

	let sizeIndex = $state(0);
	let letterIndex = $state(0);
	let currentLetter = $state('');
	let answer = $state('');
	let errorsInRow = $state(0);
	let totalErrors = $state(0);
	let totalAsked = $state(0);
	let results: { size: number; correct: boolean }[] = $state([]);
	let finished = $state(false);

	function pickLetter() {
		const pool = config.letters.toUpperCase().split('');
		currentLetter = pool[Math.floor(Math.random() * pool.length)];
		answer = '';
	}

	// Initialize
	pickLetter();

	function check(e?: Event) {
		if (e) e.preventDefault();
		if (!answer) return;

		const correct = answer.trim().toUpperCase() === currentLetter;
		totalAsked++;
		results = [...results, { size: config.sizes[sizeIndex] ?? 20, correct }];

		if (correct) {
			errorsInRow = 0;
		} else {
			errorsInRow++;
			totalErrors++;
		}

		if (errorsInRow >= 2) {
			finishTest();
			return;
		}

		letterIndex++;
		if (letterIndex >= config.letters_per_size) {
			letterIndex = 0;
			sizeIndex++;
			if (sizeIndex >= config.sizes.length) {
				finishTest();
				return;
			}
		}
		pickLetter();
	}

	function finishTest() {
		finished = true;
		// Find smallest size with at least one correct answer
		let bestIndex = -1;
		for (let i = results.length - 1; i >= 0; i--) {
			if (results[i].correct) {
				bestIndex = config.sizes.indexOf(results[i].size);
				break;
			}
		}
		if (bestIndex < 0) bestIndex = 0;

		const acuity = 2.0 - (bestIndex * 0.22); // rough mapping: 160px -> ~0.1, 20px -> ~2.0
		const clamped = Math.max(0.1, Math.min(2.0, acuity));
		const score = Math.round((clamped / 2.0) * 100);

		const message = `Острота зрения: ${clamped.toFixed(1)} (${clamped >= 1.0 ? 'в пределах нормы' : 'ниже нормы, рекомендуется консультация офтальмолога'})`;

		onComplete({
			score,
			details: { acuity: clamped.toFixed(1), total_asked: totalAsked, total_errors: totalErrors },
			message
		});
	}

	let currentSize = $derived(config.sizes[sizeIndex] ?? 20);
</script>

<div class="snellen-stage">
	{#if !finished}
		<div class="letter-display" style="font-size: {currentSize}px;">
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

		<div class="snellen-meta">
			<span>Строка {sizeIndex + 1} из {config.sizes.length}</span>
			<span>Буква {letterIndex + 1} из {config.letters_per_size}</span>
			<span class:error={errorsInRow > 0}>Ошибок подряд: {errorsInRow}</span>
		</div>
	{/if}
</div>

<style>
	.snellen-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 1rem;
	}
	.letter-display {
		font-weight: 800;
		color: #111827;
		font-family: system-ui, -apple-system, sans-serif;
		line-height: 1;
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
	}
	.test-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		max-width: 280px;
	}
	.test-input {
		font-size: 1.5rem;
		padding: 0.75rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		text-align: center;
		text-transform: uppercase;
		transition: border-color 0.2s;
		width: 100%;
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
		width: 100%;
	}
	.test-btn.primary {
		background: #2563eb;
		color: white;
	}
	.test-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}
	.snellen-meta {
		display: flex;
		gap: 1.5rem;
		font-size: 0.9rem;
		color: #6b7280;
		flex-wrap: wrap;
		justify-content: center;
	}
	.snellen-meta .error {
		color: #dc2626;
		font-weight: 600;
	}
</style>
