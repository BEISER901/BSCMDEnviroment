module.exports = {
	name: '$arg',
	description: '',
	syntax: '',
	perms: [999],
	async execute(argNumber) {
		return this.getScope().$arg[argNumber.val]
	}
}