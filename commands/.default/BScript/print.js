module.exports = {
	name: 'print',
	description: '',
	syntax: '',
	perms: [999],
	execute(...args) {
		function type(arg) {
			return arg?.type
				? 
					( 
						arg.type == "func"?
							`[FUNC${arg?.name ? "-"+arg.name : ""}]`
						: 
						arg.type == "promise"?
							`{PROMISE}`
						:
						arg.type == "text"?
							`${arg.val}`
						:
						arg.type == "number"?
							`${arg.val}`
						:
						arg.type == "bool"?
							`[${arg.val == 1? "TRUE": "FALSE"}]`
						:
						arg.type == "array"?
							`[ARRAY(${arg.val.length}){${arg.val.map(type)}}]`
						: 
						arg.type == "jstype"?
							arg.val
						:
						arg.type == "object"?
							arg.val
						:
						arg.type == "ref"?
							`[REF{${arg.prop.join(".")}}]`
						:
							`[NOTYPE ${arg.val}]`
					) 
				: 
			`[RAW ${arg}]`
		}
		this.cmdEnviroment.commandController.Print(...args.map(type))
	}
}