const { delay } = require("./SRC/utils/utils.js")
module.exports = {
	name: 'delay',
	description: '',
	syntax: '',
	perms: [999],
	async execute(ms) {
		return await delay(ms);
	}
}