<script lang="ts">
	import { enhance } from '$app/forms';

	type Props = {
		form: { error: string } | null;
	};

	let { form }: Props = $props();
</script>

<article style="max-width: 500px; margin: 40px auto;">
	<h2 style="text-align: center;">Регистрация</h2>
	{#if form?.error}<p style="color: red; text-align: center;">{form.error}</p>{/if}
	<form method="POST" use:enhance>
		<label>Придумайте логин <input name="username" type="text" required /></label>
		<label>Придумайте пароль <input name="password" type="password" required /></label>
		<button type="submit">Создать аккаунт</button>
	</form>
	<p style="text-align: center; margin-top: 20px;">Уже есть аккаунт? <a href="/login">Войти</a></p>
</article>
