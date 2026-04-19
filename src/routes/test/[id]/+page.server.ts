import db from '$server/db';
import type { Question, Test } from '$types/test';
import { redirect } from '@sveltejs/kit';

export const load = ({ params }) => {
	const test = db.prepare<unknown[], Test>('SELECT * FROM tests WHERE id = ?').get(params.id);
	const questions = db
		.prepare<unknown[], Question>('SELECT * FROM questions WHERE test_id = ?')
		.all(params.id);
	return { test, questions };
};

export const actions = {
	save: async ({ request, params, locals }) => {
		if (!locals.user) throw redirect(302, '/login');
		const data = await request.formData();
		db.prepare('INSERT INTO test_results (user_id, test_id, score) VALUES (?, ?, ?)').run(
			locals.user.id,
			params.id,
			data.get('score')
		);
		throw redirect(303, '/dashboard');
	}
};
