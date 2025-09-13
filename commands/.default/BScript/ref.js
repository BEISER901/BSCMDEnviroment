function isClass(C) {
	return typeof C === "function" && C.prototype !== undefined
}
function assign(obj, prop, value) {
    if (prop.length > 1) {
        var e = prop.shift();
        assign(obj[e] =
                 Object.prototype.toString.call(obj[e]) === "[object Object]"
                 ? obj[e]
                 : {},
               prop,
               value);
    } else{
        obj[prop[0]] = value?.type == "jstype" ? value?.val : value;
    }
}
function deep_value(obj, prop){
	let context = obj;
    for (var i=0, len=prop.length; i<len; i++){
        if(i > 0)
        	context = context[prop[i-1]];
        obj = obj[prop[i]];
    };
    if(!isClass(obj) && typeof obj == "function") {
    	return obj.bind(context)
    }
    return obj;
};


module.exports = {
	name: 'ref',
	description: '',
	syntax: '',
	perms: [999],
	execute: function(bsarg, ...props){
		let bsref = {}
		if(bsarg?.type == "object" || bsarg?.type == "jstype") {
			bsref = ({ type: "ref", prop: props.map(prop => prop.val.split(".")).flat(1), set: function(setVal){ assign(this, bsref.prop, setVal) }.bind(bsarg?.val??{}), get: function() { return deep_value(this, bsref.prop) }.bind(bsarg?.val??{}) })
		} else {
			bsref = ({ type: "ref", prop: [bsarg, ...props].map(prop => prop.val.split(".")).flat(1), set: function(setVal){ assign(this, bsref.prop, setVal) }.bind(this), get: function() {return deep_value(this, bsref.prop) }.bind(this) })
		}
		return bsref
	}
}