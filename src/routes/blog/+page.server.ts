import db from '$server/db';
export const load = () => {
	return { posts: db.prepare('SELECT id, title FROM posts').all() as any[] };
};
