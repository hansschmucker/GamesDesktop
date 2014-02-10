var ViewableItem = function(values){
	Item.call(this,values);
};

ViewableItem.inherit(Item);

ViewableItem.prototype.node = null;