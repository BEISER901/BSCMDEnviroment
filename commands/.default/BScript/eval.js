module.exports = {
	name: ['eval', 'evaluate'],
	description: '',
	syntax: '',
	perms: [999],
	async execute(code) {
		return eval(code.val);
	}
}