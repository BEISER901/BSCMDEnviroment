module.exports = {
	name: 'raw',
	description: '',
	syntax: '',
	perms: [999],
	execute(bsval) {
		return new this.Type(bsval.val)
	}
}