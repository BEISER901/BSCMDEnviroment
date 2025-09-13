module.exports = {
	name: 'num',
	description: '',
	syntax: '',
	perms: [999],
	async execute(val) {
		return { type: "number", val: Number(val.val) }
	}
}