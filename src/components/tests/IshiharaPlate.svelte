<script lang="ts">
	import type { Question } from '$types/test';

	type Props = {
		question: Question;
		onComplete: (result: { score: number; details: Record<string, unknown>; message: string }) => void;
	};

	let { question, onComplete }: Props = $props();

	let config = $state({ plates: 10 });
	try {
		if (question.options) {
			config = { ...config, ...JSON.parse(question.options) };
		}
	} catch {
		// defaults
	}

	// Plate data: predefined numbers for consistency
	const plateNumbers = [12, 8, 6, 29, 57, 5, 3, 15, 74, 2];
	const numPlates = Math.min(config.plates, plateNumbers.length);

	let currentPlate = $state(0);
	let answer = $state('');
	let correctCount = $state(0);
	let results: { plate: number; userAnswer: string; correct: boolean }[] = $state([]);
	let canvasRef = $state<HTMLCanvasElement | null>(null);

	let currentNumber = $derived(plateNumbers[currentPlate] ?? 12);

	function generatePlate(node: HTMLCanvasElement, num: number) {
		const ctx = node.getContext('2d');
		if (!ctx) return;
		const w = 300;
		const h = 300;
		node.width = w;
		node.height = h;

		// Background
		ctx.fillStyle = '#f0f0f0';
		ctx.fillRect(0, 0, w, h);

		// Create mask canvas for number shape
		const mask = document.createElement('canvas');
		mask.width = w;
		mask.height = h;
		const mctx = mask.getContext('2d')!;
		mctx.fillStyle = '#000000';
		mctx.fillRect(0, 0, w, h);
		mctx.fillStyle = '#ffffff';
		mctx.font = 'bold 140px sans-serif';
		mctx.textAlign = 'center';
		mctx.textBaseline = 'middle';
		mctx.fillText(String(num), w / 2, h / 2);
		const maskData = mctx.getImageData(0, 0, w, h).data;

		// Dot colors for normal vision
		const bgColors = ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f'];
		const numColors = ['#264653', '#1d3557', '#457b9d', '#1a1a2e'];

		// Place dots
		const dotRadius = 4;
		const spacing = 10;
		for (let y = spacing; y < h - spacing; y += spacing) {
			for (let x = spacing; x < w - spacing; x += spacing) {
				const dx = x + (Math.random() - 0.5) * spacing * 0.6;
				const dy = y + (Math.random() - 0.5) * spacing * 0.6;
				const distFromCenter = Math.sqrt((dx - w / 2) ** 2 + (dy - h / 2) ** 2);
				if (distFromCenter > 135) continue; // circular mask

				const idx = (Math.floor(dy) * w + Math.floor(dx)) * 4;
				const isNumber = maskData[idx] > 128;

				ctx.beginPath();
				ctx.arc(dx, dy, dotRadius * (0.8 + Math.random() * 0.4), 0, Math.PI * 2);
				const palette = isNumber ? numColors : bgColors;
				ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
				ctx.fill();
			}
		}
	}

	$effect(() => {
		if (canvasRef) {
			generatePlate(canvasRef, currentNumber);
		}
	});

	function submitAnswer(e?: Event) {
		if (e) e.preventDefault();
		const userVal = answer.trim();
		const correct = userVal === String(currentNumber);
		if (correct) correctCount++;
		results = [...results, { plate: currentPlate + 1, userAnswer: userVal, correct }];
		answer = '';

		if (currentPlate < numPlates - 1) {
			currentPlate++;
		} else {
			finishTest();
		}
	}

	function finishTest() {
		const score = Math.round((correctCount / numPlates) * 100);
		let message = '';
		if (score >= 90) {
			message = 'Отличный результат! Цветовое восприятие в норме.';
		} else if (score >= 70) {
			message = 'Хороший результат. Незначительные отклонения возможны.';
		} else if (score >= 50) {
			message = 'Обнаружены отклонения цветового восприятия. Рекомендуется консультация специалиста.';
		} else {
			message = 'Выявлены значительные отклонения цветового восприятия. Обратитесь к офтальмологу.';
		}

		onComplete({
			score,
			details: { correct: correctCount, total: numPlates, plates: results },
			message
		});
	}
</script>

<div class="ishihara-stage">
	<canvas bind:this={canvasRef} class="ishihara-canvas" width="300" height="300"></canvas>

	<form onsubmit={submitAnswer} class="test-form">
		<input
			type="text"
			inputmode="numeric"
			bind:value={answer}
			placeholder="Число или 0"
			required
			class="test-input"
			autocomplete="off"
		/>
		<button type="submit" class="test-btn primary">Ответить</button>
	</form>

	<div class="ishihara-meta">
		<span>Пластина {currentPlate + 1} из {numPlates}</span>
		<span>Правильно: {correctCount}</span>
	</div>

	<button class="skip-btn" onclick={() => { answer = '0'; submitAnswer(); }} type="button">
		Не вижу числа
	</button>
</div>

<style>
	.ishihara-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 1rem;
	}
	.ishihara-canvas {
		border-radius: 50%;
		box-shadow: 0 4px 24px rgba(0,0,0,0.12);
		width: 280px;
		height: 280px;
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
		background: #2563eb;
		color: white;
	}
	.test-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}
	.ishihara-meta {
		display: flex;
		gap: 1.5rem;
		font-size: 0.9rem;
		color: #6b7280;
	}
	.skip-btn {
		font-size: 0.9rem;
		padding: 0.5rem 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.15s;
	}
	.skip-btn:hover {
		border-color: #9ca3af;
		color: #374151;
	}
</style>
