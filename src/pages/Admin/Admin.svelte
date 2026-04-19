<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Post } from '$types/post';
	import type { Question, Test } from '$types/test';

	type Props = {
		posts: Post[];
		tests: Test[];
		questions: Question[];
		form: { success: string } | null;
	};
	let { posts, tests, questions, form }: Props = $props();

	// Управление табами
	let activeTab = $state<'posts' | 'tests'>('posts'); // 'posts' или 'tests'
	// Состояние для редактирования статьи
	let editPostId = $state<null | string>(null);
	let editTitle = $state('');
	let editContent = $state('');
	// Состояние для редактирования вопроса
	let editQuestionId = $state<null | string>(null);

	function startEditPost(post: Post) {
		editPostId = post.id;
		editTitle = post.title;
		editContent = post.content;
	}

	// Вспомогательная функция для названия теста
	function getTestTitle(testId: number) {
		const t = tests.find((t) => t.id === testId);
		return t ? t.title : 'Неизвестный тест';
	}
</script>

<h1>Панель администратора</h1>

{#if form?.success}
	<article style="background: #d4edda; color: #155724; padding: 10px; margin-bottom: 20px;">
		{form.success}
	</article>
{/if}

<!-- Навигация табов -->
<nav style="margin-bottom: 20px;">
	<ul>
		<li>
			<button class={activeTab === 'posts' ? '' : 'outline'} onclick={() => (activeTab = 'posts')}>
				📚 Статьи (Блог)
			</button>
		</li>
		<li>
			<button class={activeTab === 'tests' ? '' : 'outline'} onclick={() => (activeTab = 'tests')}>
				🎯 Тесты и Вопросы
			</button>
		</li>
	</ul>
</nav>

{#if activeTab === 'posts'}
	<!-- ================= ВЛАДКА БЛОГА ================= -->
	<article>
		<h2>Управление блогом</h2>
		{#if editPostId}
			<h4>Редактирование статьи</h4>
			<form method="POST" action="?/edit_post" use:enhance onsubmit={() => (editPostId = null)}>
				<input type="hidden" name="id" value={editPostId} />
				<label>Заголовок <input name="title" bind:value={editTitle} required /></label>
				<label
					>Содержание <textarea name="content" rows="4" bind:value={editContent} required
					></textarea></label
				>
				<div class="grid">
					<button type="submit">Сохранить</button>
					<button type="button" class="secondary outline" onclick={() => (editPostId = null)}
						>Отмена</button
					>
				</div>
			</form>
		{:else}
			<h4>Новая статья</h4>
			<form method="POST" action="?/add_post" use:enhance>
				<label>Заголовок <input name="title" required /></label>
				<label>Содержание (Markdown) <textarea name="content" rows="3" required></textarea></label>
				<button type="submit">Опубликовать</button>
			</form>
		{/if}

		<hr />
		<h4>Существующие статьи</h4>
		<ul>
			{#each posts as post (post.id)}
				<li>
					<strong>{post.title}</strong>
					<div style="display: flex; gap: 10px; margin-top: 5px;">
						<button
							class="outline secondary"
							style="padding: 2px 10px; width: auto;"
							onclick={() => startEditPost(post)}>Редактировать</button
						>
						<form
							method="POST"
							action="?/delete_post"
							use:enhance
							style="margin:0;"
							onsubmit={(e) => {
								if (!confirm('Точно удалить статью?')) e.preventDefault();
							}}
						>
							<input type="hidden" name="id" value={post.id} />
							<button
								class="outline"
								style="padding: 2px 10px; width: auto; color: red; border-color: red;"
								type="submit">Удалить</button
							>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	</article>
{:else}
	<!-- ================= ВЛАДКА ТЕСТОВ ================= -->
	<div class="grid">
		<!-- Левая колонка: Управление самими тестами -->
		<article>
			<h2>Система Тестов</h2>
			<h4>Добавить тест</h4>
			<form
				method="POST"
				action="?/add_test"
				use:enhance
				style="display: flex; gap: 10px; align-items: flex-end;"
			>
				<label style="flex: 1;">Название <input name="title" required style="margin:0;" /></label>
				<label style="flex: 1;"
					>Описание <input name="description" required style="margin:0;" /></label
				>
				<button type="submit" style="width: auto; margin:0;">Создать</button>
			</form>

			<ul style="margin-top: 15px;">
				{#each tests as test (test.id)}
					<li style="display: flex; justify-content: space-between; margin-bottom: 5px;">
						<span><strong>{test.title}</strong> <small>({test.description})</small></span>
						<form
							method="POST"
							action="?/delete_test"
							use:enhance
							style="margin:0;"
							onsubmit={(e) => {
								if (!confirm('Удалить тест и ВСЕ результаты пользователей?')) e.preventDefault();
							}}
						>
							<input type="hidden" name="id" value={test.id} />
							<button
								class="outline"
								style="padding: 0px 8px; width: auto; color: red; border-color: red;"
								type="submit">Удалить</button
							>
						</form>
					</li>
				{/each}
			</ul>
		</article>

		<!-- Правая колонка: Добавление вопросов -->
		<article>
			<h2>Новый вопрос</h2>
			<form method="POST" action="?/add_question" use:enhance>
				<label
					>Привязать к тесту
					<select name="test_id" required>
						{#each tests as test (test.id)}<option value={test.id}>{test.title}</option>{/each}
					</select>
				</label>
				<label
					>Текст вопроса <input
						name="question_text"
						type="text"
						placeholder="Необязательно"
					/></label
				>
				<label
					>Картинка (URL) <input name="image_url" type="url" placeholder="Необязательно" /></label
				>
				<label>Ответ <input name="answer" type="text" required /></label>
				<button type="submit" class="secondary">Сохранить вопрос</button>
			</form>
		</article>
	</div>

	<!-- Таблица вопросов на всю ширину под сеткой -->
	<article style="margin-top: 20px;">
		<h2>Существующие вопросы</h2>
		<div class="overflow-auto">
			<table>
				<thead
					><tr
						><th>Тест</th><th>Текст вопроса</th><th>Картинка URL</th><th>Ответ</th><th>Действия</th
						></tr
					></thead
				>
				<tbody>
					{#each questions as q (q.id)}
						{#if editQuestionId === q.id}
							<!-- Режим редактирования -->
							<tr>
								<td>{getTestTitle(q.test_id)}</td>
								<td colspan="4">
									<form
										method="POST"
										action="?/edit_question"
										use:enhance
										onsubmit={() => (editQuestionId = null)}
										style="margin: 0; display: flex; gap: 10px;"
									>
										<input type="hidden" name="id" value={q.id} />
										<input
											type="text"
											name="question_text"
											value={q.question_text}
											placeholder="Текст"
											style="flex:1;"
										/>
										<input
											type="url"
											name="image_url"
											value={q.image_url}
											placeholder="URL"
											style="flex:1;"
										/>
										<input
											type="text"
											name="answer"
											value={q.answer}
											required
											style="width: 100px;"
										/>
										<button type="submit" style="width: auto; padding: 5px;">💾</button>
										<button
											type="button"
											class="secondary outline"
											onclick={() => (editQuestionId = null)}
											style="width: auto; padding: 5px;">❌</button
										>
									</form>
								</td>
							</tr>
						{:else}
							<!-- Режим просмотра -->
							<tr>
								<td>{getTestTitle(q.test_id)}</td>
								<td>{q.question_text || '-'}</td>
								<td
									>{#if q.image_url}<a href={q.image_url} target="_blank">Ссылка</a
										>{:else}-{/if}</td
								>
								<td><strong>{q.answer}</strong></td>
								<td style="display: flex; gap: 5px;">
									<button
										class="secondary outline"
										style="padding: 2px 10px; width: auto;"
										onclick={() => (editQuestionId = q.id)}>✏️</button
									>
									<form method="POST" action="?/delete_question" use:enhance style="margin: 0;">
										<input type="hidden" name="id" value={q.id} />
										<button
											style="padding: 2px 10px; width: auto; background-color: #e53935; border: none; color: white;"
											type="submit">🗑</button
										>
									</form>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</article>
{/if}
