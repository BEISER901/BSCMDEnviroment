module.exports = {
	name: 'await',
	description: '',
	syntax: '',
	perms: [999],
	async execute(arg1, arg2, ...args) {
		if(arg1?.type == 'promise') {
			return await arg1.val
		} else {
			if(arg1?.val == "run") {
				if(typeof arg2?.val == 'function'){
					return await arg2.val(...args.map(arg=>arg?.val));
				}
				if(this.getScope()?.$val?.[arg2]?.type == "func"){
					return await this.getScope().$val[arg2].val(...args);
				}
			} else {
				return await this.getScope().$val[arg1].val
			}
		}
	}
}