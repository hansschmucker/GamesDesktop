var ItemCollection = function(){
	Arrayish.call(this);
	
	this.addEventListener("add",this.onItemCollectionAddBound=new Bound(this.onItemCollectionAdd,this));
	this.addEventListener("remove",this.onItemCollectionRemoveBound=new Bound(this.onItemCollectionRemove,this));
	
	this.onItemCollectionItemUpdateBound=new Bound(this.onItemCollectionItemUpdate,this)
}
ItemCollection.inherit(Arrayish);

ItemCollection.prototype.onItemCollectionAddBound=null;
ItemCollection.prototype.onItemCollectionRemoveBound=null;
ItemCollection.prototype.onItemCollectionItemUpdateBound=null;
ItemCollection.prototype.title = "";

ItemCollection.prototype.onItemCollectionAdd = function(evt){
	//Attach listener for update
	evt.item.addEventListener("update",this.onItemCollectionItemUpdateBound);
};

ItemCollection.prototype.onItemCollectionRemove = function(evt){
	evt.item.removeEventListener("update",this.onItemCollectionItemUpdateBound);
};

ItemCollection.prototype.onItemCollectionItemUpdate = function(evt){
	var index=this.findFirst(evt.item);
	this.dispatchEvent("update",{
		item:evt.item,
		arrayish:this,
		field:evt.field,
		previous:evt.prev,
		value:evt.value,
		index:index
	});
};


ItemCollection.prototype.sort = function(sortFunc){
	var srcList=this.toArray();
	srcList.sort(sortFunc);
	var i=0;
	for(;i<srcList.length;i++){
		var err=-1;
		for(var j=i;j<srcList.length &&err<0;j++){
			if(srcList[j]!=this.getItem(j)){
				err=j;
				info(this.getItem(j).getTitle());
			}
		}

		if(err>=0){
			info("ERR "+err)
			//err is now the first incorrect item: Find the right one and insert it
			var item =null;
			//srcList[j] is the one we want
			for(var k=err+1;k<srcList.length && !item;k++){
				if(srcList[err]==this.getItem(k)){
					info("FOUND "+k+" "+this.getLength())
					item=this.remove(k);
					this.insert(err,item);
				}
			}
		}
	}
}

/**
 * Produces a simple clone that is always of type ItemCollection, no matter whether the original instance was of a subclass
 */
ItemCollection.prototype.toItemCollection = function(){
	var out=new ItemCollection();
	for(var i=0;i<this.getLength();i++)
		out.push(this.getItem(i));

	return out;
}


ItemCollection.prototype.toString = function(){
	return "["+this._arrayishItems.join(",")+"]";
}