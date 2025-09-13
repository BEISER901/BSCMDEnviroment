module.exports = {
	name: '$val',
	description: '',
	syntax: '',
	perms: [999],
	execute(bsarg0, bsarg1) {
		if(bsarg0?.type == "ref") {
			return bsarg0.get()
		}
		if(bsarg0.val == "exist"){
			return { type: "bool", val: this.getScope().$val[bsarg1.val] ? 1 : 0 }
		}
		bsarg0 = this.getScope().$val[bsarg0.val];
		return bsarg0? !bsarg0.type && !bsarg0.val? { type: "RAW", val: bsarg0 } : bsarg0 : null;
	}
}