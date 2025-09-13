module.exports = {
	name: 'Input',
	description: '',
	syntax: '',
	perms: [999],
	async execute(prefix) {
		const test = await this.cmdEnviroment.Input(prefix.val);
		return test
	}
}