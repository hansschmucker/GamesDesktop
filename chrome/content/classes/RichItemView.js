var RichItemView = function (parent){
	ItemView.call(this,parent);

}

RichItemView.inherit(ItemView);

RichItemView.prototype.onAdd=function(evt){
	ItemView.prototype.onAdd.call(this,evt);

	var el=evt.item.node;

	if(!el.querySelector(".imageUrl")){
		var img=document.createElement("img");
		img.className="imageUrl";
		img.src=evt.item.getImageUrl();
		el.appendChild(img);
	}
	if(!el.querySelector(".title")){
		var title=document.createElement("div");
		title.className="title";
		title.textContent=evt.item.getTitle();
		el.appendChild(title);
	}
}

RichItemView.prototype.onUpdate=function(evt){
	ItemView.prototype.onUpdate.call(this,evt);
	var el=evt.item.node;
	if(evt.field=="imageUrl"){
		el.querySelector(".imageUrl").src=evt.value;
	}else if(evt.field=="title"){
		el.querySelector(".title").textContent=""+evt.value;
		el.querySelector(".imageUrl").setAttribute("alt",evt.value);
		el.querySelector(".imageUrl").setAttribute("title",evt.value);
	}
}

RichItemView.prototype.onRemove = function(evt){
	ItemView.prototype.onRemove.call(this,evt);
}