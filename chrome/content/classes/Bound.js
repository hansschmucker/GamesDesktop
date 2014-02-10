/**
 * Bounds serve as a stand-in for function pointers, which not only executes the
 * function, but does so in the specified scope. Note however that native functions
 * will not expect Bound objects. In that case the Bound object must be converted
 * to a function using nativeFunc.
 * @param func
 * @param scope
 * @constructor
 */
var Bound = function(func,scope){
	this.func = func;
	this.scope = scope;
};

Bound.prototype.func = null;
Bound.prototype.scope = null;

Bound.prototype.call = function(scope,args){
	args=Array.prototype.slice.call(arguments);
	args.shift();
	
	if(scope == null)
		return this.func.apply(this.scope,args);
	else
		return this.func.apply(null,args);
};

Bound.prototype.apply = function(scope,args){
	if(scope == null)
		return this.func.apply(this.scope,args);
	else
		return this.func.apply(null,args);
};

Bound.prototype.nativeFunc = function(extra){
	var self = this.func;
	var sc=this.scope;
	var f=function(){
		var args=Array.prototype.slice.call(arguments);
		if(extra)
			args=extra.concat(args);
		args.push(this);
		return self.apply(sc,args);
	};
	f.func = self;
	f.scope = sc;
	return f;
};