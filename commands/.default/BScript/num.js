module.exports = {
	name: 'num',
	description: '',
	syntax: '',
	perms: [999],
	execute(val) {
		return new this.Type({ type: "number", val: Number(val.val) })
	}
}