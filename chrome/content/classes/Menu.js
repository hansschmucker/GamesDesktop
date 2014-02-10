var Menu = function(){
	Eventable.call(this);
}

Menu.inherit(Eventable);
/*
	Item,
	Item,
	{title:[
		Item
	]}

 */
Menu.prototype.data = null;

Menu.prototype.show = function(){

};

Menu.prototype._build = function(){
	var container = document.createElement("div");
	for(var i=0;i<this.data.length;i++){
		var el=document.createElement("div");
		el.textContent=i;
		el.setAttribute("data-id",this.data[i]);
		container.appendChild()
	}
}

Menu.prototype._onMenuItemClick = function(evt,el){
	this.dispatchEvent("click",{
		menu:this,
		id:el.id
	});
}