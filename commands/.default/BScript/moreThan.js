module.exports = {
	name: 'more?',
	description: '',
	syntax: '',
	perms: [999],
	execute: (n1Type, n2Type) => ({ type: "bool", val: (n1Type?.type == 'number'? n1Type?.val : null) > (n2Type?.type == 'number'? n2Type?.val : null) })
}