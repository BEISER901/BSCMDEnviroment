module.exports = {
	name: 'print',
	description: '',
	syntax: '',
	perms: [999],
	execute(...args) {
		this.cmdEnviroment.commandController.Print(...args.map(x=>x.GetDisplayType()))
	}
}