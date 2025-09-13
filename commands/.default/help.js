module.exports = {
	name: 'help',
	description: 'Выводит все команды одним списком.',
	syntax: 'help',
	execute() {
		this.cmdEnviroment.commandController.Print(
'Список команд:\
\n================================================\
\n\n\
	{string} - Строковое значение. \n\
	\n\
	 {int} - Числовое значение.\n\
	 {bool} - Булевое значение.\n\
	 {setarg} - установочный аргумент\n\
	 {arg} - аргумент.\n\n\
================================================\n\n',
			Object.keys(this.cmdEnviroment.commandController.CMD._commands).map(key => 
`\n\
	Command: ${key}\n\
	Desciption: ${this.cmdEnviroment.commandController.CMD._commands[key].description}\n\
	Syntax: ${this.cmdEnviroment.commandController.CMD._commands[key].syntax}\n\
`
				).join("\n")
			);
	}
}