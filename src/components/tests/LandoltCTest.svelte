<script lang="ts">
	import type { Question } from '$types/test';

	type Props = {
		question: Question;
		onComplete: (result: { score: number; details: Record<string, unknown>; message: string }) => void;
	};

	let { question, onComplete }: Props = $props();

	let config = $state({
		sizes: [120, 100, 80, 60, 50, 40, 30, 20],
		per_size: 2
	});

	try {
		if (question.options) {
			config = { ...config, ...JSON.parse(question.options) };
		}
	} catch {
		// defaults
	}

	const directions = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'] as const;
	type Direction = (typeof directions)[number];

	let sizeIndex = $state(0);
	let roundIndex = $state(0);
	let currentDir = $state<Direction>('top');
	let errorsInRow = $state(0);
	let totalErrors = $state(0);
	let totalAsked = $state(0);
	let finished = $state(false);

	function pickDirection() {
		currentDir = directions[Math.floor(Math.random() * directions.length)];
	}

	pickDirection();

	function answer(dir: Direction) {
		if (finished) return;
		const correct = dir === currentDir;
		totalAsked++;

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

		roundIndex++;
		if (roundIndex >= config.per_size) {
			roundIndex = 0;
			sizeIndex++;
			if (sizeIndex >= config.sizes.length) {
				finishTest();
				return;
			}
		}
		pickDirection();
	}

	function finishTest() {
		finished = true;
		let bestIndex = sizeIndex;
		if (errorsInRow >= 2 && roundIndex === 0 && sizeIndex > 0) {
			bestIndex = sizeIndex - 1;
		}
		const bestSize = config.sizes[bestIndex] ?? config.sizes[0];
		// Score mapping: larger size = lower score
		const maxSize = config.sizes[0];
		const minSize = config.sizes[config.sizes.length - 1];
		const ratio = (maxSize - bestSize) / (maxSize - minSize);
		const score = Math.max(5, Math.round(ratio * 100));

		const minutes = Math.round((5 - ratio * 5) * 10) / 10;
		const message = `Угловое разрешение: ~${minutes} угловых минут. ${score >= 70 ? 'Хороший результат' : score >= 40 ? 'Средний результат' : 'Рекомендуется проверка у офтальмолога'}.`;

		onComplete({
			score,
			details: { best_size: bestSize, total_asked: totalAsked, total_errors: totalErrors },
			message
		});
	}

	let currentSize = $derived(config.sizes[sizeIndex] ?? 20);

	function rotation(dir: Direction): number {
		const map: Record<Direction, number> = {
			top: 0,
			'top-right': 45,
			right: 90,
			'bottom-right': 135,
			bottom: 180,
			'bottom-left': 225,
			left: 270,
			'top-left': 315
		};
		return map[dir];
	}

	function dirLabel(dir: Direction): string {
		const map: Record<Direction, string> = {
			top: '↑',
			'top-right': '↗',
			right: '→',
			'bottom-right': '↘',
			bottom: '↓',
			'bottom-left': '↙',
			left: '←',
			'top-left': '↖'
		};
		return map[dir];
	}
</script>

<div class="landolt-stage">
	{#if !finished}
		<div class="landolt-display">
			<svg viewBox="0 0 200 200" width="300" height="300">
				<circle cx="100" cy="100" r={currentSize} fill="none" stroke="#111827" stroke-width={Math.max(4, currentSize * 0.12)} />
				<line
					x1="100"
					y1="100"
					x2="100"
					y2={100 - currentSize}
					stroke="#ffffff"
					stroke-width={Math.max(6, currentSize * 0.18)}
					transform="rotate({rotation(currentDir)} 100 100)"
				/>
			</svg>
		</div>

		<div class="landolt-controls">
			<div class="landolt-row">
				<button class="landolt-dir" onclick={() => answer('top-left')} type="button">↖</button>
				<button class="landolt-dir" onclick={() => answer('top')} type="button">↑</button>
				<button class="landolt-dir" onclick={() => answer('top-right')} type="button">↗</button>
			</div>
			<div class="landolt-row">
				<button class="landolt-dir" onclick={() => answer('left')} type="button">←</button>
				<div class="landolt-center">{dirLabel(currentDir)}</div>
				<button class="landolt-dir" onclick={() => answer('right')} type="button">→</button>
			</div>
			<div class="landolt-row">
				<button class="landolt-dir" onclick={() => answer('bottom-left')} type="button">↙</button>
				<button class="landolt-dir" onclick={() => answer('bottom')} type="button">↓</button>
				<button class="landolt-dir" onclick={() => answer('bottom-right')} type="button">↘</button>
			</div>
		</div>

		<div class="landolt-meta">
			<span>Размер {sizeIndex + 1} из {config.sizes.length}</span>
			<span>Попытка {roundIndex + 1} из {config.per_size}</span>
			<span class:error={errorsInRow > 0}>Ошибок подряд: {errorsInRow}</span>
		</div>
	{/if}
</div>

<style>
	.landolt-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem;
	}
	.landolt-display {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0,0,0,0.06);
		padding: 1rem;
	}
	.landolt-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}
	.landolt-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.landolt-dir {
		width: 64px;
		height: 64px;
		font-size: 1.5rem;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		background: white;
		cursor: pointer;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.landolt-dir:hover {
		border-color: #2563eb;
		background: #eff6ff;
		transform: scale(1.05);
	}
	.landolt-dir:active {
		transform: scale(0.98);
		background: #dbeafe;
	}
	.landolt-center {
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		color: #9ca3af;
	}
	.landolt-meta {
		display: flex;
		gap: 1.5rem;
		font-size: 0.9rem;
		color: #6b7280;
		flex-wrap: wrap;
		justify-content: center;
	}
	.landolt-meta .error {
		color: #dc2626;
		font-weight: 600;
	}
</style>
