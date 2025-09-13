module.exports = {
	name: 'object',
	description: '',
	syntax: '',
	perms: [999],
	execute: (bsval) => {
		function barraysToObject(barrs, test=0) {
			if(barrs[0]?.type == "text")
				return { [barrs[0]?.val]: barrs[1]?.val }
			else
				return barrs.reduce((obj, barr) => {
					obj[barr.val[0].val] = barr.val[1]?.type == "array"? barraysToObject(barr.val[1].val, ++test) : barr.val[1].val
					return obj;
				}, {})
		}

		if(bsval?.type == "array")
			return ({ type: "object", val: barraysToObject(bsval.val) })
	}
}