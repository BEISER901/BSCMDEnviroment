module.exports = {
	name: 'js',
	description: '',
	syntax: '',
	perms: [999],
	execute: (req) => {
		return require(req.val)
	}
}