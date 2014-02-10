Function.prototype.inherit=function(base){
	var proxy=function(){};
	proxy.prototype=base.prototype;
	this.prototype=new proxy();
};
