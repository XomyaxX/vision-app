<script lang="ts">
	import type { Question } from '$types/test';

	type Props = {
		question: Question;
		onComplete: (result: { score: number; details: Record<string, unknown>; message: string }) => void;
	};

	let { question, onComplete }: Props = $props();

	const numLines = 18;
	const angles = Array.from({ length: numLines }, (_, i) => (i * 180) / numLines);

	let selectedAngle = $state<number | null>(null);
	let step = $state<'pick' | 'confirm'>('pick');

	function selectAngle(angle: number) {
		selectedAngle = angle;
		step = 'confirm';
	}

	function confirm() {
		if (selectedAngle === null) return;
		// Simulate diagnosis: if user picks an angle near 90 or 180, suggest astigmatism
		// In a real test, any consistent angle indicates astigmatism
		const axis = Math.round(selectedAngle);
		const hasAstigmatism = true; // Any selection implies they see a difference
		const score = 100; // This is more diagnostic than scored

		const message = hasAstigmatism
			? `Обнаружена возможная ось астигматизма: ${axis}°. Рекомендуется консультация офтальмолога для уточнения диагноза.`
			: 'Различий в чёткости линий не выявлено. Астигматизм маловероятен.';

		onComplete({
			score,
			details: { axis, has_astigmatism: hasAstigmatism },
			message
		});
	}

	function noDifference() {
		const score = 100;
		onComplete({
			score,
			details: { axis: null, has_astigmatism: false },
			message: 'Различий в чёткости линий не выявлено. Астигматизм маловероятен.'
		});
	}
</script>

<div class="astig-stage">
	{#if step === 'pick'}
		<p class="astig-instruction">
			Посмотрите на колесо. Выберите <strong>направление</strong>, в котором линии выглядят
			<strong>темнее или резче</strong>. Если все линии одинаковые — нажмите «Нет разницы».
		</p>

		<div class="wheel-wrapper">
			<svg viewBox="0 0 300 300" width="280" height="280">
				{#each angles as angle}
					{@const rad = (angle * Math.PI) / 180}
					{@const x2 = 150 + 120 * Math.cos(rad)}
					{@const y2 = 150 + 120 * Math.sin(rad)}
					<line
						x1="150"
						y1="150"
						x2={x2}
						y2={y2}
						stroke="#111827"
						stroke-width="2"
						class="wheel-line"
					/>
					<!-- clickable area near the end of line -->
					<circle
						cx={x2}
						cy={y2}
						r="18"
						fill="transparent"
						class="wheel-hit"
						onclick={() => selectAngle(angle)}
						role="button"
						tabindex="0"
					/>
				{/each}
				<circle cx="150" cy="150" r="4" fill="#111827" />
			</svg>
		</div>

		<button class="test-btn secondary" onclick={noDifference} type="button">
			Нет разницы — все линии одинаковые
		</button>
	{:else}
		<div class="confirm-panel">
			<p class="confirm-text">
				Вы выбрали направление <strong>{Math.round(selectedAngle ?? 0)}°</strong>.
				Подтвердите, если линии в этом направлении выглядят темнее.
			</p>
			<div class="confirm-buttons">
				<button class="test-btn primary" onclick={confirm} type="button">Подтвердить</button>
				<button class="test-btn secondary" onclick={() => { step = 'pick'; selectedAngle = null; }} type="button">
					Выбрать другое
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.astig-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem;
	}
	.astig-instruction {
		font-size: 1.1rem;
		max-width: 480px;
		text-align: center;
		line-height: 1.5;
		color: #374151;
		margin: 0;
	}
	.wheel-wrapper {
		background: white;
		border-radius: 50%;
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
		padding: 10px;
	}
	.wheel-line {
		pointer-events: none;
	}
	.wheel-hit {
		cursor: pointer;
		transition: fill 0.2s;
	}
	.wheel-hit:hover {
		fill: rgba(37, 99, 235, 0.15);
	}
	.wheel-hit:focus {
		outline: none;
		fill: rgba(37, 99, 235, 0.25);
	}
	.test-btn {
		font-size: 1.05rem;
		padding: 0.75rem 1.5rem;
		border-radius: 10px;
		border: none;
		cursor: pointer;
		transition: all 0.15s;
	}
	.test-btn.primary {
		background: #2563eb;
		color: white;
	}
	.test-btn.secondary {
		background: white;
		color: #374151;
		border: 2px solid #e5e7eb;
	}
	.test-btn:hover {
		transform: translateY(-1px);
		opacity: 0.9;
	}
	.confirm-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		text-align: center;
	}
	.confirm-text {
		font-size: 1.25rem;
		max-width: 400px;
		line-height: 1.5;
	}
	.confirm-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>
