var GOGGameItem = function(regId){
	ViewableItem.call(this);

	this.setRegId(regId);
	var sn=this.getValue("SUPPORTLINK");
	if(!sn){
		sn=this.getValue("GAMENAME").toLowerCase().replace(/[^a-z0-9]/gi," ").trim().replace(/\s+/g,"_");
		info(sn);
	}

	this.setSupportName(sn);

	var gb=MiniCacheService.getValue("http://www.gog.com/game/"+this.getSupportName()+".game_box-_bb_20",0x19BFCC00);
	if(gb!=null){
		this.setImageUrl(gb);
	}else{
		var r=new DOMRetriever("http://www.gog.com/game/"+this.getSupportName());

		r.addEventListener("load",new Bound(this.gogGameItemOnLoad,this));
		r.fetch();
	}
};

GOGGameItem.inherit(ViewableItem);

GOGGameItem.prototype._url = "about:blank";
GOGGameItem.prototype.setUrl = function(value){ this._setField("url",value); };
GOGGameItem.prototype.getUrl = function(){ return this._url; };

GOGGameItem.prototype._imageUrl = "media/default.png";
GOGGameItem.prototype.setImageUrl = function(value){ this._setField("imageUrl",value); };
GOGGameItem.prototype.getImageUrl = function(){ return this._imageUrl; };

GOGGameItem.prototype._lastLaunch = 0;
GOGGameItem.prototype.setLastLaunch = function(value){ this._setField("lastLaunch",value); };
GOGGameItem.prototype.getLastLaunch = function(){ return this._lastLaunch; };

GOGGameItem.prototype._firstEncounter = 0;
GOGGameItem.prototype.setFirstEncounter = function(value){ this._setField("firstEncounter",value); };
GOGGameItem.prototype.getFirstEncounter = function(){ return this._firstEncounter; };


GOGGameItem.prototype.gogGameItemOnLoad = function(e){
	var i=e.document.querySelector(".game_box");
	if(i){
		var iu=i.src.replace(/_bb_20\./,".");
		MiniCacheService.setValue("http://www.gog.com/game/"+this.getSupportName()+".game_box-_bb_20",iu);
		this.setImageUrl(iu);
	}else{
		//FIXME Removed pending further review : Seems to loop on Driver PL
		//FIXME Implement online database for known aliases
		/*
		var r=new Retriever("http://www.gog.com/games/ajax?a=topMenuSearch&s="+encodeURIComponent(this.getValue("GAMENAME"))+"&t=0")
		r.addEventListener("load",new Bound(this.gogGameItemSearchOnLoad,this));
		r.fetch();
		*/
	}
};

GOGGameItem.prototype.gogGameItemSearchOnLoad = function(e){
	try{
		info(e.text);
		var t=JSON.decode(e.text);
		info(t.toSource());
		if(t && t.results && t.results.count){
			info("HTML "+t.results.html);
			var res=/<a href="\/game\/(.*?)"/.exec(t.results.html);

			if(res){
				info("MATCH"+res[1]);
				this.setSupportName(res[1]);

				var r=new DOMRetriever("http://www.gog.com/game/"+this.getSupportName());

				r.addEventListener("load",new Bound(this.gogGameItemOnLoad,this));
				r.fetch();
			}
		}
	}catch(e){
		info(e);
	}

}

GOGGameItem.prototype._regId = "";
GOGGameItem.prototype.setRegId = function(value){ this._setField("regId",value); };
GOGGameItem.prototype.getRegId = function(){ return this._regId; };

GOGGameItem.prototype.getData = function(){
	var data = Item.prototype.getData.call(this);
	data.tag = this._tag;

	return data;
};

GOGGameItem.prototype._supportName = "";
GOGGameItem.prototype.setSupportName = function(value){ this._setField("supportName",value); };
GOGGameItem.prototype.getSupportName = function(){ return this._supportName; };

GOGGameItem.prototype.getData = function(){
	var data = Item.prototype.getData.call(this);
	data.regId = this._regId;
	data.supportName = this._supportName;

	data.url=this._url;
	data.imageUrl=this._imageUrl;
	data.lastLaunch=this._lastLaunch;
	data.firstEncounter=this._firstEncounter;

	return data;
};


GOGGameItem.prototype.getValue = function(regValue){
	var reg=Instances.WindowsRegKey;

	reg.open(reg.ROOT_KEY_LOCAL_MACHINE,"Software",reg.ACCESS_ENUMERATE_SUB_KEYS|reg.ACCESS_READ);
	if(!reg.hasChild("GOG.com")){
		reg.close();
		return "";
	}
	var gogReg=reg.openChild("GOG.com",reg.ACCESS_ENUMERATE_SUB_KEYS|reg.ACCESS_READ);

	if(!gogReg.hasChild(this.getRegId())){
		gogReg.close();
		reg.close();
		return "";
	}
	var sub=gogReg.openChild(this.getRegId(),gogReg.ACCESS_ENUMERATE_SUB_KEYS|gogReg.ACCESS_READ);

	var r="";
	if(sub.hasValue(regValue) && sub.getValueType(regValue)){
		r=sub.readStringValue(regValue);
	}

	sub.close();
	gogReg.close();
	reg.close();

	return r;
}

GOGGameItem.prototype.launch = function(){
	var cmd=this.getValue("EXE");
	var path=this.getValue("PATH");
	var param=this.getValue("LAUNCHPARAM");

	var proc=Process;
	var file = Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties)
		.get("CurProcD", Components.interfaces.nsIFile);
	file.append("bin");
	file.append("StartW.exe");
	proc.init(file);
	proc.run(false,[path,cmd,param],3);
}
