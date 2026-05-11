import Database from 'better-sqlite3';

const db = new Database('vision.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user');
  CREATE TABLE IF NOT EXISTS vision_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, left_eye REAL, right_eye REAL, astigmatism TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS tests (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT);
  CREATE TABLE IF NOT EXISTS test_results (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, test_id INTEGER, score INTEGER, details TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, test_id INTEGER, question_text TEXT, image_url TEXT, answer TEXT, type TEXT DEFAULT 'text', options TEXT);
`);

// Migrate: add columns if they don't exist
const questionsColumns = db.prepare("PRAGMA table_info(questions)").all() as { name: string }[];
const hasQType = questionsColumns.some((c) => c.name === 'type');
const hasQOptions = questionsColumns.some((c) => c.name === 'options');
if (!hasQType) db.exec("ALTER TABLE questions ADD COLUMN type TEXT DEFAULT 'text'");
if (!hasQOptions) db.exec("ALTER TABLE questions ADD COLUMN options TEXT");

const resultsColumns = db.prepare("PRAGMA table_info(test_results)").all() as { name: string }[];
const hasRDetails = resultsColumns.some((c) => c.name === 'details');
if (!hasRDetails) db.exec("ALTER TABLE test_results ADD COLUMN details TEXT");

const adminExists = db.prepare("SELECT * FROM users WHERE username = 'admin'").get();
if (!adminExists) {
	import('bcryptjs').then((bcrypt) => {
		const hash = bcrypt.hashSync('admin', 10);
		db.prepare("INSERT INTO users (username, password, role) VALUES ('admin', ?, 'admin')").run(
			hash
		);
	});
}

const testCount = db.prepare('SELECT COUNT(*) as count FROM tests').get() as { count: number };
if (testCount.count === 0) {
	const info = db
		.prepare(
			"INSERT INTO tests (title, description) VALUES ('Смешанный тест', 'Проверка на дальтонизм и теорию')"
		)
		.run();
	const testId = info.lastInsertRowid;
	db.prepare(
		"INSERT INTO questions (test_id, question_text, image_url, answer) VALUES (?, 'Какое число вы видите?', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Ishihara_9.png', '74')"
	).run(testId);
	db.prepare(
		"INSERT INTO questions (test_id, question_text, image_url, answer) VALUES (?, 'Сколько глаз у обычного человека?', '', '2')"
	).run(testId);
}

// Seed new professional vision tests
function seedIfMissing(title: string, description: string, questions: { question_text: string; image_url: string; answer: string; type: string; options?: string }[]) {
	const existing = db.prepare('SELECT id FROM tests WHERE title = ?').get(title);
	if (existing) return;
	const test = db.prepare('INSERT INTO tests (title, description) VALUES (?, ?)').run(title, description);
	const testId = test.lastInsertRowid;
	const stmt = db.prepare(
		'INSERT INTO questions (test_id, question_text, image_url, answer, type, options) VALUES (?, ?, ?, ?, ?, ?)'
	);
	for (const q of questions) {
		stmt.run(testId, q.question_text, q.image_url, q.answer, q.type, q.options ?? null);
	}
}

seedIfMissing(
	'Острота зрения (Снеллен)',
	'Определение остроты зрения по таблице Снеллена. Назовите буквы, которые видите. Тест адаптивный: при двух ошибках подряд тест завершается. Рекомендуется проходить на расстоянии ~3 метров от экрана.',
	[
		{
			question_text: 'Назовите букву',
			image_url: '',
			answer: '',
			type: 'snellen',
			options: JSON.stringify({
				letters: 'CDEFHKLNPRUVWXYZ',
				sizes: [160, 120, 100, 80, 60, 50, 40, 30, 20],
				letters_per_size: 2
			})
		}
	]
);

seedIfMissing(
	'Тест Ландольта',
	'Определите направление просвета в кольце. Используйте кнопки-стрелки. Тест адаптивный: размер уменьшается при правильных ответах.',
	[
		{
			question_text: 'Выберите направление просвета',
			image_url: '',
			answer: '',
			type: 'landolt',
			options: JSON.stringify({
				sizes: [120, 100, 80, 60, 50, 40, 30, 20],
				per_size: 2
			})
		}
	]
);

seedIfMissing(
	'Тест на дальтонизм (Ишихара)',
	'Распознайте числа на цветных пластинах. Если число не видно, выберите "Не вижу". Тест содержит 10 пластин.',
	[
		{
			question_text: 'Распознайте числа на пластинах',
			image_url: '',
			answer: '',
			type: 'ishihara',
			options: JSON.stringify({ plates: 10 })
		}
	]
);

seedIfMissing(
	'Тест на астигматизм',
	'Посмотрите на колесо с лучами. Выберите направление, в котором линии выглядят темнее или резче. Если все линии одинаковые — выберите "Нет разницы".',
	[
		{
			question_text: 'Выберите направление темных линий',
			image_url: '',
			answer: '',
			type: 'astigmatism',
			options: '{}'
		}
	]
);

seedIfMissing(
	'Контрастная чувствительность',
	'Назовите букву. Контраст будет постепенно уменьшаться. Тест показывает, насколько низкий контраст вы способны различить.',
	[
		{
			question_text: 'Назовите букву',
			image_url: '',
			answer: '',
			type: 'contrast',
			options: JSON.stringify({
				letters: 'CDEFHKLNPRUVWXYZ',
				levels: [100, 50, 25, 12, 6, 3]
			})
		}
	]
);

seedIfMissing(
	'Тест Амслера',
	'Зафиксируйте взгляд на центральной точке сетки. Ответьте, видите ли искажения, волны или пропуски в каждом квадранте.',
	[
		{
			question_text: 'В верхнем-левом квадранте есть искажения или пропуски?',
			image_url: '',
			answer: '0',
			type: 'amsler',
			options: JSON.stringify({ quadrant: 'top-left' })
		},
		{
			question_text: 'В верхнем-правом квадранте есть искажения или пропуски?',
			image_url: '',
			answer: '0',
			type: 'amsler',
			options: JSON.stringify({ quadrant: 'top-right' })
		},
		{
			question_text: 'В нижнем-левом квадранте есть искажения или пропуски?',
			image_url: '',
			answer: '0',
			type: 'amsler',
			options: JSON.stringify({ quadrant: 'bottom-left' })
		},
		{
			question_text: 'В нижнем-правом квадранте есть искажения или пропуски?',
			image_url: '',
			answer: '0',
			type: 'amsler',
			options: JSON.stringify({ quadrant: 'bottom-right' })
		}
	]
);

seedIfMissing(
	'Дихроматический тест (Духром)',
	'На каком фоне текст выглядит чётче — красном или зелёном? Этот тест помогает оценить тенденцию к близорукости или дальнозоркости.',
	[
		{
			question_text: 'Какой текст чётче?',
			image_url: '',
			answer: 'same',
			type: 'duochrome',
			options: JSON.stringify({ red_text: 'О Ч К И', green_text: 'О Ч К И' })
		}
	]
);

seedIfMissing(
	'Тест на ведущий глаз',
	'Определите, какой глаз у вас ведущий. Вытяните руку, сделайте отверстие между большим и указательным пальцами, направьте на удалённый объект. Поочерёдно закройте глаза.',
	[
		{
			question_text: 'Какой глаз видит объект в центре отверстия?',
			image_url: '',
			answer: '',
			type: 'dominance',
			options: JSON.stringify({ choices: ['Левый глаз', 'Правый глаз', 'Оба одинаково'] })
		}
	]
);

export default db;
