<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { route } from '$constants/routes';
	import { page } from '$app/state'; // <-- Импортируем $page для получения текущего URL

	type Props = {
		data: LayoutData;
		children: Snippet;
	};

	let { data, children }: Props = $props();

	// Функция проверки активной страницы
	// Мы используем startsWith, чтобы при заходе в /blog/123 вкладка "Блог" все равно светилась
	function isActive(path: string) {
		if (path === route('/')) {
			return page.url.pathname === path; // Для главной страницы нужно точное совпадение
		}
		return page.url.pathname.startsWith(path);
	}
</script>

<header class="container">
	<nav>
		<ul>
			<li><strong><a href={route('/')} class="contrast">Чистый взгляд</a></strong></li>
		</ul>
		<ul>
			<!-- Используем директиву class:active для автоматического добавления класса -->
			<li>
				<a href={route('/dashboard')} class:active={isActive(route('/dashboard'))}>Прогресс</a>
			</li>
			<li><a href={route('/test')} class:active={isActive(route('/test'))}>Тесты</a></li>
			<li><a href={route('/blog')} class:active={isActive(route('/blog'))}>Блог</a></li>

			{#if data.user}
				{#if data.user.role === 'admin'}
					<li>
						<a
							href={route('/admin')}
							class:active={isActive(route('/admin'))}
							style="color: var(--pico-primary);"
						>
							⚙️ Админка
						</a>
					</li>
				{/if}

				<li>
					<a href={route('/settings')} class="secondary" class:active={isActive(route('/settings'))}
						>Настройки</a
					>
				</li>
				<li>
					<form action="/logout" method="POST" style="margin:0;">
						<button type="submit" class="outline" style="padding: 5px 10px;">Выйти</button>
					</form>
				</li>
			{:else}
				<li><a href={route('/login')} role="button" class="outline">Вход</a></li>
			{/if}
		</ul>
	</nav>
</header>

<main class="container">
	{@render children()}
</main>

<style>
	.active {
		color: var(--pico-primary) !important;
		font-weight: bold;
		text-decoration: underline;
		text-underline-offset: 4px;
	}
</style>
