import { redirect, fail } from '@sveltejs/kit';
import db from '$server/db';
import bcrypt from 'bcryptjs';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		try {
			const hash = bcrypt.hashSync(password, 10);
			const info = db
				.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
				.run(username, hash);
			cookies.set('session', info.lastInsertRowid.toString(), {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7
			});
			throw redirect(303, '/dashboard');
		} catch {
			return fail(400, { error: 'Пользователь уже существует' });
		}
	}
};
