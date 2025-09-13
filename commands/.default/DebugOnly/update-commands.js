module.exports = {
	name: 'update-commands',
	description: 'Обновить все команды.',
	syntax: 'update-commands',
	async execute() {
		this.cmdEnviroment._updateCommands();
	}
}