import db from '$server/db';
import type { Test } from '$types/test';

export const load = () => {
	return { tests: db.prepare<unknown[], Test>('SELECT * FROM tests').all() };
};
