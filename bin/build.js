const fs = require('fs/promises');
const path = require('path');
const webpack = require('webpack');

const getConfig = (name) => require('../webpack/' + name);

const script = async () => {
	// Удаляем прошлую сборку проекта
	await fs.rmdir(path.resolve('dist'), { recursive: true });

	// Устанавливаем зависимости
	process.env.NODE_ENV = 'production';

	// Клиент
	const clientConfig = getConfig('client');
	const clientCompiler = webpack(clientConfig);

	// Сервер
	const serverConfig = getConfig('server');
	const serverCompiler = webpack(serverConfig);

	clientCompiler.run(() => {
		serverCompiler.run(() => {});
	});
};

script();
