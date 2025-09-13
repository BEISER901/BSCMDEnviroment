module.exports = {
	name: 'clear',
	description: 'Очищает комадную строку.',
	syntax: 'clear',
	execute() {
		this.cmdEnviroment.commandController.ClearConsole();
	}
}