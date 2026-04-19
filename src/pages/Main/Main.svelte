<script lang="ts">
	import { route } from '$constants/routes';
</script>

<div class="container">
	<article class="article">
		<div class="title-wrapper">
			<h1 class="title">👁️ Чистый взгляд</h1>
			<p class="subtitle">Ваш личный помощник для контроля и проверки зрения</p>
		</div>

		<div class="links">
			<a href={route('/test')} role="button">Пройти тест зрения</a>
			<a href={route('/dashboard')} role="button" class="secondary">Моя статистика</a>
			<a href={route('/blog')} role="button" class="outline">Читать статьи</a>
		</div>
	</article>

	<section>
		<div class="grid">
			<div>
				<h3>📈 Графики</h3>
				<p>Отслеживайте динамику вашего зрения в удобном личном кабинете.</p>
			</div>
			<div>
				<h3>🎨 Тесты на дальтонизм</h3>
				<p>Проверьте свое цветоощущение по таблицам Ишихары.</p>
			</div>
			<div>
				<h3>📚 Полезный блог</h3>
				<p>Читайте советы врачей по сохранению здоровья глаз.</p>
			</div>
		</div>
	</section>
</div>

<style>
	.article {
		display: flex;
		text-align: center;
		padding: 40px 20px;
		flex-direction: column;
		gap: 40px;
	}
	.title-wrapper {
		display: flex;
		flex-direction: column;
	}
	.title {
		font-size: 3rem;
	}
	.subtitle {
		font-size: 1.2rem;
		color: var(--pico-muted-color);
	}
	.links {
		display: flex;
		gap: 15px;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
