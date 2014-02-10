/**
 *
 * @constructor
 * @extends {Eventable}
 */
var Arrayish = function(){
	Eventable.call(this);

	this._arrayishItems = [];
};

Arrayish.inherit(Eventable);


Arrayish.prototype._arrayishItems = null;

Arrayish.prototype.toArrayish = function(){
	var out=new Arrayish();
	for(var i=0;i<this.getLength();i++)
		out.push(this.getItem(i));


	return out;
};

Arrayish.prototype.push = function(item){
	return this.insert(this.getLength(),item);
};

Arrayish.prototype.pop = function(){
	var len=this.getLength();
	if(len>0)
		return this.remove(len-1);
	else
		return null;
};

Arrayish.prototype.setItem = function(index,item){
	var oldItem=this.remove(index);
	this.insert(index,item);
	return oldItem;
};

Arrayish.prototype.getItem = function(index){
	return this._arrayishItems[index];
};

Arrayish.prototype.toArray = function(){
	return Array.prototype.slice.call(this._arrayishItems);
};

Arrayish.prototype.remove = function(index){
	var item = this._arrayishItems[index];
	this._arrayishItems.splice(index,1);
	this.dispatchEvent("remove",{
		action:"remove",
		arrayish:this,
		item:item,
		index:index
	});
	return item;
};

Arrayish.prototype.insert = function(index,item){
	this._arrayishItems.splice(index,0,item);
	this.dispatchEvent("add",{
		action:"add",
		arrayish:this,
		item:item,
		index:index
	});
};

Arrayish.prototype.clear = function(){
	while(this.getLength()){
		this.pop();
	}
};

Arrayish.prototype.findFirst = function(el){
	for(var i=0;i<this.getLength();i++)
		if(this.getItem(i)==el)
			return i;
	
	return -1;
};

Arrayish.prototype.getLength = function(){
	return this._arrayishItems.length;
};

Arrayish.prototype.toString = function(){
	return "["+JSON.stringify(this._arrayishItems)+"]";
};