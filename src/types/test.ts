export type Test = {
	id: number;
	title: string;
	description: string;
};

export type TestResult = {
	id: string;
	test_id: number;
	created_at: string;
	score: number;
	details?: string;
};

export type Question = {
	id: string;
	test_id: number;
	question_text: string;
	answer: string;
	image_url?: string;
	type?: string;
	options?: string;
};
