import express, { Response } from 'express';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';

// Глобальные переменные
const PORT = process.env.PORT ?? 4040;
const PUBLIC_PATH: string = path.resolve('dist', 'public');

// Создаем серверное приложение
const app = express();

// Публичная папка
app.use(express.static(PUBLIC_PATH));

// Настройки защиты
app.use(
	helmet({
		contentSecurityPolicy: IS_PROD,
	}),
);

// Настройка сжатия
app.use(compression({}));

// Тестовый роут
app.all('/test', (_: unknown, res: Response) => {
	res.send('Testing route working!!!');
});

// Listening
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
