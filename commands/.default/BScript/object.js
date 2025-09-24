module.exports = {
	name: 'object',
	description: '',
	syntax: '',
	perms: [999],
	execute(bsval) {
		// function barraysToObject(barrs, test=0) {
		// 	if(barrs[0]?.type == "text")
		// 		return { [barrs[0]?.val]: barrs[1]?.val }
		// 	else
		// 		return barrs.reduce((obj, barr) => {
		// 			obj[barr.val[0].val] = barr.val[1]?.type == "array"? barraysToObject(barr.val[1].val, ++test) : barr.val[1].val
		// 			return obj;
		// 		}, {})
		// }
		const obj = {}
		if(bsval?.type == 'array') {
			bsval.val.map(x => {
				obj[x.name] = x.val;
			})
		} else {
			obj[bsval.name] = bsval.val
		}
		return new this.Type({ type: "object", val: obj })
	}
}