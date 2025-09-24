module.exports = {
	name: 'str',
	description: '',
	syntax: '',
	perms: [999],
	execute(...bsvals) {
		return new this.Type({ type: "text", val: bsvals.filter(x=>x).map(x=>x.val).join("") })
	}
}