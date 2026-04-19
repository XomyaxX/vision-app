import { redirect, fail } from '@sveltejs/kit';
import db from '$server/db';
import bcrypt from 'bcryptjs';
import type { User } from '$types/user';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		const user = db
			.prepare<unknown[], User & { password: string }>('SELECT * FROM users WHERE username = ?')
			.get(username);
		if (!user || !bcrypt.compareSync(password, user.password)) {
			return fail(400, { error: 'Неверный логин или пароль' });
		}

		cookies.set('session', user.id.toString(), {
			path: '/',
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7
		});
		throw redirect(303, '/dashboard');
	}
};
