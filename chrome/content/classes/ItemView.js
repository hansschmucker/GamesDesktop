var ItemView = function(parent){
	Eventable.call(this);
	this.items = new ItemCollection();
	this.items.addEventListener("add",new Bound(this.onAdd,this));
	this.items.addEventListener("remove",new Bound(this.onRemove,this));
	this.items.addEventListener("update",new Bound(this.onUpdate,this));

	
	this._onItemNativeClickBound=(new Bound(this.onItemNativeClick,this)).nativeFunc();
	if(parent)
		this.attach(parent);
};

ItemView.inherit(Eventable);

ItemView.prototype.items = null;
ItemView.prototype._parentNode = null;
ItemView.prototype._onItemNativeClickBound = null;

ItemView.prototype.onItemNativeClick = function(evt,src){
	for(var i=0;i<this.items.getLength();i++)
		if(src==this.items.getItem(i).node){
			this.dispatchEvent("mousedown",{
				nativeEvent:evt,
				index:i,
				item:this.items.getItem(i),
				element:src
			});
			return;
		}
			
};

ItemView.prototype.onAdd = function(evt){
	var el=document.createElement("div");
	el.className="Item";
	el.addEventListener("mousedown",this._onItemNativeClickBound,false);
	if(this._parentNode){
		info("ADDED: "+evt.item.getTitle()+" "+(evt.item.node?evt.item.node.textContent:"")+" "+evt.index);
		if((evt.index+1)<this.items.getLength()){
			info(this.items.getItem(evt.index+1).node.parentNode);
			this._parentNode.insertBefore(el,this.items.getItem(evt.index+1).node);
		}else
			this._parentNode.appendChild(el);
	}
	evt.item.node=el;
};

ItemView.prototype.onRemove = function(evt){

	evt.item.node.removeEventListener("mousedown",this._onItemNativeClickBound,false);
	if(this._parentNode){
		info("REMOVED: "+evt.item.getTitle()+" "+(evt.item.node?evt.item.node.textContent:"")+" "+evt.index);
		this._parentNode.removeChild(evt.item.node);
	}
	evt.item.node = null;
};

ItemView.prototype.onUpdate = function(evt){

};

ItemView.prototype.detach = function(){
	if(!this._parentNode)
		return;
	
	for(var i=0;i<this.items.getLength();i++)
		this.items.getItem(i).node._parentNode.removeChild(this.items.getItem(i).node);
};

ItemView.prototype.attach = function(_parentNode){
	this.detach();
	
	this._parentNode=_parentNode;
	for(var i=0;i<this.items.getLength();i++)
		this._parentNode.appendChild(this.items.getItem(i).node);
};
