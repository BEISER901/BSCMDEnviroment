module.exports = {
	name: 'bool',
	description: '',
	syntax: '',
	perms: [999],
	execute: (bsval) => ({ type: "bool", val: Number(bsval) == 0 || Number(bsval) == 1 ? Number(bsval) : 0 })
}