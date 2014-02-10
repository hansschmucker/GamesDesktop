var Item = function(values){
	Eventable.call(this);
	if(values){
		if(typeof(values.title)=="string")
			this.setTitle(values.title);
	}
};

Item.inherit(Eventable);

Item.prototype._setField = function(field,value){
	if(value!=this["_"+field]){
		var prev = this["_"+field];
		this["_"+field] = value;
		info(field);
		this.dispatchEvent("update",{
			item:this,
			field:field,
			previous:prev,
			value:value
		});
	}	
};

Item.prototype._title = "Default";
Item.prototype.setTitle = function(value){ this._setField("title",value); };
Item.prototype.getTitle = function(){ return this._title; };



Item.prototype.getData = function(){
	return {title:this._title};
};

Item.prototype.toString = function(){
	return JSON.encode(this.getData());
};