window.onload=function(){

	var list=[];
	for(var c in Components.classes){
		list.push(c);
	}
	list.sort();

	var Moz={};
	var o="";

	for(var k=0;k<list.length;k++){
		var c=list[k];
		var src=list[k];
		src=src.replace(/^@mozilla\.org\//,"");
		var suffix="";
		if(src.indexOf("?")>=0){
			suffix=src.substr(src.indexOf("?")+1);
			src=src.substr(0,src.indexOf("?"));
		}
		//src=src.replace(/\;[0-9]+$/,"");
		src=src.split("/");
		if(suffix)
			src.push(suffix);


		for(var i=0;i<src.length;i++){
			src[i]=src[i].replace(/^([a-z])/i,function(m){ return m.toLowerCase(); } );
			src[i]=src[i].replace(/[^a-z]([a-z])/gi,function(m){ return m.toUpperCase(); } );
			src[i]=src[i].replace(/[^a-z0-9]/gi,"");
		}

		var obj=Moz;
		var path="MozCc";
		for(var i=0;i<src.length-1;i++){
			if(!obj[src[i]]){
				obj[src[i]]={};
				path+="."+src[i];
				o+=path+'={};\n';
			}
		}
		obj[src[src.length-1]]=Components.classes[c];
		path+="."+src[src.length-1];
		o+=path+'=Components.classes["'+c+'"];\n';
	}


	var Ccl=[];
	for(var i in Components.classes)
		Ccl.push(i);

	Ccl.sort();

	var Cil=[];
	for(var i in Components.interfaces)
		Cil.push(i);

	Cil.sort();

	/*Ccl=[
		"@mozilla.org/audiochannel/service;1",
		"@mozilla.org/downloads/application-reputation-service;1",
		"@mozilla.org/gamepad-test;1",
		"@mozilla.org/places/colorAnalyzer;1",
		"@mozilla.org/startupcache/cache;1"
	];*/
	var o="";
	//alert(Ccl.length);
	for(var ii=0;ii<Ccl.length;ii++){
		var i=Ccl[ii];

		try{
			var service=Components.classes[i].getService();

			for(var jj=0;jj<Cil.length;jj++){
				var j=Cil[jj];
				//alert(i+" "+j);
				try{
					service.QueryInterface(Components.interfaces[j]);
					o+=i+" "+j+"\n";
					//alert(i+" "+j);
				}catch(e){
				}

			}

		}catch(e){
		}

	}

	document.querySelector("pre").textContent= o;
}