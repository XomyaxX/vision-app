<script lang="ts">
	import type { Question } from '$types/test';

	type Props = {
		question: Question;
		onAnswer: (answer: string, isCorrect: boolean) => void;
		questionNumber: number;
		totalQuestions: number;
	};

	let { question, onAnswer }: Props = $props();

	let quadrant = $state('top-left');

	try {
		if (question.options) {
			const parsed = JSON.parse(question.options);
			if (parsed.quadrant) quadrant = parsed.quadrant;
		}
	} catch {
		// default
	}

	const labels: Record<string, string> = {
		'top-left': 'верхнем-левом',
		'top-right': 'верхнем-правом',
		'bottom-left': 'нижнем-левом',
		'bottom-right': 'нижнем-правом'
	};

	function answer(value: 'yes' | 'no') {
		const isCorrect = value === 'no';
		onAnswer(value, isCorrect);
	}
</script>

<div class="test-stage">
	<div class="amsler-wrapper">
		<svg viewBox="0 0 200 200" class="amsler-svg">
			<rect x="0" y="0" width="200" height="200" fill="#1a1a1a" />
			<!-- Grid lines -->
			{#each Array(11) as _, i}
				<line x1={i * 20} y1="0" x2={i * 20} y2="200" stroke="#cc0000" stroke-width="0.5" />
				<line x1="0" y1={i * 20} x2="200" y2={i * 20} stroke="#cc0000" stroke-width="0.5" />
			{/each}
			<!-- Center dot -->
			<circle cx="100" cy="100" r="3" fill="white" />
			<!-- Highlight quadrant -->
			{#if quadrant === 'top-left'}
				<rect x="0" y="0" width="100" height="100" fill="rgba(255,255,255,0.08)" stroke="#2563eb" stroke-width="1" stroke-dasharray="4 2" />
			{:else if quadrant === 'top-right'}
				<rect x="100" y="0" width="100" height="100" fill="rgba(255,255,255,0.08)" stroke="#2563eb" stroke-width="1" stroke-dasharray="4 2" />
			{:else if quadrant === 'bottom-left'}
				<rect x="0" y="100" width="100" height="100" fill="rgba(255,255,255,0.08)" stroke="#2563eb" stroke-width="1" stroke-dasharray="4 2" />
			{:else if quadrant === 'bottom-right'}
				<rect x="100" y="100" width="100" height="100" fill="rgba(255,255,255,0.08)" stroke="#2563eb" stroke-width="1" stroke-dasharray="4 2" />
			{/if}
		</svg>
	</div>

	<p class="amsler-instruction">
		Зафиксируйте взгляд на <strong>белой точке в центре</strong>.
		Не двигайте глазами.
		Видите ли вы искажения, волны или пропуски в <strong>{labels[quadrant] ?? quadrant}</strong> квадранте?
	</p>

	<div class="amsler-buttons">
		<button class="amsler-btn yes" onclick={() => answer('yes')} type="button">Да, вижу</button>
		<button class="amsler-btn no" onclick={() => answer('no')} type="button">Нет, всё ровно</button>
	</div>
</div>

<style>
	.test-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}
	.amsler-wrapper {
		width: 280px;
		height: 280px;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(0,0,0,0.2);
	}
	.amsler-svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.amsler-instruction {
		font-size: 1.1rem;
		max-width: 480px;
		text-align: center;
		line-height: 1.5;
		color: #374151;
		margin: 0;
	}
	.amsler-buttons {
		display: flex;
		gap: 1rem;
		width: 100%;
		max-width: 400px;
		justify-content: center;
	}
	.amsler-btn {
		flex: 1;
		font-size: 1.1rem;
		padding: 1rem 1.5rem;
		border-radius: 12px;
		border: none;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.15s;
	}
	.amsler-btn.yes {
		background: #fef3c7;
		color: #92400e;
		border: 2px solid #f59e0b;
	}
	.amsler-btn.no {
		background: #d1fae5;
		color: #065f46;
		border: 2px solid #10b981;
	}
	.amsler-btn:hover {
		transform: translateY(-2px);
		opacity: 0.9;
	}
	.amsler-btn:active {
		transform: translateY(0);
	}
</style>
