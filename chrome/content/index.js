try{
	var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	observerService.addObserver({
		observe:function(subject, topic, data){
			subject.defaultView.addEventListener("load",function(evt){
				
			},false);
		}
	},"document-element-inserted", false);
}catch(e){
	alert(e);
}