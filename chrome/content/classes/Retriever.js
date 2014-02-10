var Retriever = function(url){
	this._request = new XMLHttpRequest();
	this._request.open("GET",url);
	this._request.addEventListener("load",new Bound(this.onRequestLoad,this).nativeFunc(),false);
	this._request.addEventListener("error",new Bound(this.onRequestError,this).nativeFunc(),false);

	Eventable.call(this);
};

Retriever.inherit(Eventable);

Retriever.prototype._request = null;

Retriever.prototype.onRequestLoad = function(evt){
	this.dispatchEvent("load",{
		text:this._request.responseText,
		retriever:this,
		error:null
	});
};


Retriever.prototype.onRequestError = function(evt){
	this.dispatchEvent("load",{
		document:null,
		retriever:this,
		error:evt
	});
};

Retriever.prototype.fetch = function(){
	this._request.send(null);
};
