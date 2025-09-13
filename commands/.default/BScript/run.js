module.exports = {
	name: 'run',
	description: '',
	syntax: '',
	perms: [999],
	execute(func, ...args) {
		if(typeof func?.val == 'function'){
			return func.val(...args.map(arg=>arg.val));
		}
		if(this.getScope()?.$val?.[func?.val]?.type == "func")
			return this.getScope().$val[func?.val].val(...args);
	}
}