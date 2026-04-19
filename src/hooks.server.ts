import db from '$server/db';
import type { User } from '$types/user';

export const handle = async ({ event, resolve }) => {
	const userId = event.cookies.get('session');

	if (userId) {
		const user = db.prepare<unknown[], User>('SELECT id, role FROM users WHERE id = ?').get(userId);
		if (user) event.locals.user = { id: user.id, role: user.role };
	}
	return resolve(event);
};
