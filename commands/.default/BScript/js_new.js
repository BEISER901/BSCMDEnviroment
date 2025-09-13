module.exports = {
	name: 'js_new',
	description: '',
	syntax: '',
	perms: [999],
	execute: (jsTypeClass, ...args) => {
		return new jsTypeClass.val(...args.map(x=>x?.val??x))
	}
}