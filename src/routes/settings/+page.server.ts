import { redirect, fail } from '@sveltejs/kit';
import db from '$server/db';
import bcrypt from 'bcryptjs';
import type { User } from '$types/user';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	return { user: locals.user };
};

export const actions = {
	// 1. Смена пароля
	change_password: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');
		const data = await request.formData();
		const oldPassword = data.get('old_password') as string;
		const newPassword = data.get('new_password') as string;

		// Достаем пользователя из базы для проверки старого пароля
		const user = db
			.prepare<unknown[], User & { password: string }>('SELECT password FROM users WHERE id = ?')
			.get(locals.user.id);

		if (!bcrypt.compareSync(oldPassword, user?.password ?? '')) {
			return fail(400, { errorPwd: 'Старый пароль введен неверно' });
		}

		// Хэшируем новый и сохраняем
		const hash = bcrypt.hashSync(newPassword, 10);
		db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, locals.user.id);

		return { successPwd: true };
	},

	// 2. Удаление аккаунта
	delete_account: async ({ locals, cookies }) => {
		if (!locals.user) throw redirect(302, '/login');

		// Удаляем всю связанную историю пользователя (чтобы не забивать базу)
		db.prepare('DELETE FROM test_results WHERE user_id = ?').run(locals.user.id);
		db.prepare('DELETE FROM vision_logs WHERE user_id = ?').run(locals.user.id);

		// Удаляем самого пользователя
		db.prepare('DELETE FROM users WHERE id = ?').run(locals.user.id);

		// Удаляем куку (разлогиниваем) и выкидываем на главную
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/');
	}
};
