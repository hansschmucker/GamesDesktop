var DOMRetriever = function(url){
	Retriever.call(this,url);
};

DOMRetriever.inherit(Retriever);

DOMRetriever.prototype.onRequestLoad = function(evt){
	var parser = DOMParser;
	var doc=parser.parseFromString((this._request.responseText),"text/html");
	if(!doc ||!doc.documentElement || !doc.documentElement.nodeName || doc.documentElement.nodeName.toUpperCase()=="PARSEERROR")
		this.onRequestError("PARSEERROR");
	else
		this.dispatchEvent("load",{
			document:doc,
			retriever:this,
			error:null
		});
};
