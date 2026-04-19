import db from '$server/db';
import type { Post } from '$types/post';

export const load = ({ params }) => {
	return { post: db.prepare<unknown[], Post>('SELECT * FROM posts WHERE id = ?').get(params.id) };
};
