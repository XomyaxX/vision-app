import { redirect } from '@sveltejs/kit';

export const POST = async ({ cookies, locals }) => {
	// Явно указываем те же параметры (secure: false, sameSite: 'lax'), что и при создании
	cookies.delete('session', {
		path: '/',
		secure: false,
		sameSite: 'lax'
	});

	// Очищаем объект в памяти сервера
	locals.user = undefined;

	// Перекидываем на страницу входа
	throw redirect(303, '/login');
};
