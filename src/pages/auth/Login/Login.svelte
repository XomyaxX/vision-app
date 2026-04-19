<script lang="ts">
	import { enhance } from '$app/forms';

	type Props = {
		form: { error: string } | null;
	};

	let { form }: Props = $props();
</script>

<article style="max-width: 500px; margin: 40px auto;">
	<h2 style="text-align: center;">Вход</h2>
	{#if form?.error}<p style="color: red; text-align: center;">{form.error}</p>{/if}
	<form method="POST" use:enhance>
		<label>Логин <input name="username" type="text" required /></label>
		<label>Пароль <input name="password" type="password" required /></label>
		<button type="submit">Войти</button>
	</form>
	<p style="text-align: center; margin-top: 20px;">
		Нет аккаунта? <a href="/register">Зарегистрироваться</a>
	</p>
</article>
