var GOGInstalledLibrary = function(parent){
	RichItemView.call(this,parent);
	var games=this._getGameItems();

	for(var i=0;i<games.length;i++){
		games[i].setTitle(games[i].getValue("GAMENAME"));
		this.items.push(games[i]);
	}
}

GOGInstalledLibrary.inherit(RichItemView);

GOGInstalledLibrary.prototype._getGameItems = function(){

	var reg=Instances.WindowsRegKey;
	reg.open(reg.ROOT_KEY_LOCAL_MACHINE,"Software",reg.ACCESS_ENUMERATE_SUB_KEYS|reg.ACCESS_READ);
	if(!reg.hasChild("GOG.com")){
		reg.close();
		return 0;
	}

	var gogReg=reg.openChild("GOG.com",reg.ACCESS_ENUMERATE_SUB_KEYS|reg.ACCESS_READ);

	var r=[];

	for(var i=0;i<gogReg.childCount;i++){
		var c=gogReg.getChildName(i);
		var branch=gogReg.openChild(c,reg.ACCESS_ENUMERATE_SUB_KEYS|reg.ACCESS_READ);
		if(branch.hasValue("GAMENAME"))
			r.push(new GOGGameItem(c));
		branch.close();
	}

	gogReg.close();
	reg.close();

	return r;
};
