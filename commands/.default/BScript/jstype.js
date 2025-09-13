module.exports = {
	name: 'jstype',
	description: '',
	syntax: '',
	perms: [999],
	execute: (bsval) => {
		return { type: "jstype", val: bsval?.type == "ref" ? bsval.get() : bsval.val}
	}
}