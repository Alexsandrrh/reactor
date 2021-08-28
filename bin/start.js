const { choosePort } = require("react-dev-utils/WebpackDevServerUtils");
const DevServer = require("webpack-dev-server");
const webpack = require("webpack");
const fs = require("fs/promises");
const path = require("path");

const getConfig = (name) => require("../webpack/" + name);

const script = async () => {
	// Удаляем прошлую сборку проекта
	await fs.rmdir(path.resolve("dist"), { recursive: true });

	// Проверяем на занятость порты
	const DEV_SERVER_PORT = await choosePort(
		"127.0.0.1",
		process.env.DEV_SERVER_PORT ?? 3030
	);

	// Устанавливаем зависимости
	process.env.NODE_ENV = "development";
	process.env.DEV_SERVER_HOST = "127.0.0.1";
	process.env.DEV_SERVER_PORT = DEV_SERVER_PORT;
	process.env.PUBLIC_PATH = `http://${process.env.DEV_SERVER_HOST}:${process.env.DEV_SERVER_PORT}/`;

	// Клиент
	const clientConfig = getConfig("client");
	const clientCompiler = webpack(clientConfig);

	// Сервер
	let watching = null;
	const serverConfig = getConfig("server");
	const serverCompiler = webpack(serverConfig);

	// Смотрим на завершение процесса с клиентом
	clientCompiler.hooks.done.tap("app", () => {
		if (watching) {
			return;
		}

		// Создаем watcher для сервера
		watching = serverCompiler.watch({}, (stats) => {
			console.error(stats);
		});
	});

	// Запускаем сервер разработки
	const devServerOptions = {
		headers: { "Access-Control-Allow-Origin": "*" },
		host: process.env.DEV_SERVER_HOST,
		port: DEV_SERVER_PORT,
	};
	const devServer = new DevServer(devServerOptions, clientCompiler);

	await devServer.start();
};

script();
