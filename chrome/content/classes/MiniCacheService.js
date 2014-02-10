try{
	Components.utils.import("resource://gre/modules/Services.jsm");
	Components.utils.import("resource://gre/modules/FileUtils.jsm");

	var MiniCacheService = {};

	MiniCacheService._file = FileUtils.getFile("ProfD", ["MiniCacheService.sqlite"]);
	MiniCacheService._db = Services.storage.openDatabase(MiniCacheService._file);

	MiniCacheService._tableExists =MiniCacheService._db.createStatement("SELECT COUNT(*) AS length FROM 'sqlite_master' WHERE type='table' AND name='MiniCacheService'");

	(function(){
		try{
		MiniCacheService._tableExists.executeStep();
		var tableExists = MiniCacheService._tableExists.row.length;
		info("_tableExists "+tableExists);
		MiniCacheService._tableExists.reset();
		if(!tableExists)
			MiniCacheService._db.executeSimpleSQL("CREATE TABLE MiniCacheService (key TEXT PRIMARY KEY,value TEXT, time LONG)");
		}catch(e){
			info(e);
		}
	})();

	MiniCacheService._readKeyQuery=MiniCacheService._db.createStatement("SELECT value FROM MiniCacheService WHERE key = :key AND time > :time");
	MiniCacheService._getKeyValidLengthQuery=MiniCacheService._db.createStatement("SELECT COUNT(*) AS length FROM MiniCacheService WHERE key = :key AND time > :time");
	MiniCacheService._getKeyLengthQuery=MiniCacheService._db.createStatement("SELECT COUNT(*) AS length FROM MiniCacheService WHERE key = :key");
	MiniCacheService._insertKeyQuery=MiniCacheService._db.createStatement("INSERT INTO MiniCacheService (key,value,time) VALUES(:key,:value,:time)");
	MiniCacheService._updateKeyQuery=MiniCacheService._db.createStatement("UPDATE MiniCacheService SET value=:value, time=:time WHERE key = :key");
	MiniCacheService._deleteKeyQuery=MiniCacheService._db.createStatement("DELETE FROM MiniCacheService WHERE key = :key");
	MiniCacheService.hasValue = function(key,maxAge,cTime){
		info("REQ"+key);
		var time=cTime||Date.now();
		MiniCacheService._getKeyValidLengthQuery.params.key = key;
		MiniCacheService._getKeyValidLengthQuery.params.time = time-maxAge;
		MiniCacheService._getKeyValidLengthQuery.executeStep();
		info("_getKeyValidLengthQuery "+MiniCacheService._getKeyValidLengthQuery.row.length);
		var count = MiniCacheService._getKeyValidLengthQuery.row.length;
		MiniCacheService._getKeyValidLengthQuery.reset();

		return count>0;
	};

	MiniCacheService.setValue = function(key,value){
		var time=Date.now();
		info("REQUSET"+key);
		MiniCacheService._getKeyLengthQuery.params.key = key;
		MiniCacheService._getKeyLengthQuery.executeStep();
		info("_getKeyLengthQuery");
		var count = MiniCacheService._getKeyLengthQuery.row.length;
		MiniCacheService._getKeyLengthQuery.reset();

		info("REQUSETC"+count);
		if(count>0){
			MiniCacheService._updateKeyQuery.params.key = key;
			MiniCacheService._updateKeyQuery.params.value = value;
			MiniCacheService._updateKeyQuery.params.time = time;
			MiniCacheService._updateKeyQuery.executeStep();
			info("_updateKeyQuery");
			MiniCacheService._updateKeyQuery.reset();
		}else{
			MiniCacheService._insertKeyQuery.params.key = key;
			MiniCacheService._insertKeyQuery.params.value = value;
			MiniCacheService._insertKeyQuery.params.time = time;
			MiniCacheService._insertKeyQuery.executeStep();
			info("_insertKeyQuery");
			MiniCacheService._insertKeyQuery.reset();
		}
	};

	MiniCacheService.getValue = function(key,maxAge){
		var time=Date.now();

		var has=MiniCacheService.hasValue(key,maxAge,time);

		if(!has)
			return null;

		MiniCacheService._readKeyQuery.params.key = key;
		MiniCacheService._readKeyQuery.params.time = time-maxAge;
		MiniCacheService._readKeyQuery.executeStep();
		info("_readKeyQuery");

		var value = MiniCacheService._readKeyQuery.row.value;
		info(value);
		MiniCacheService._readKeyQuery.reset();

		return value;
	};

	window.addEventListener("beforeunload",function(evt){
		MiniCacheService._readKeyQuery.finalize();
		MiniCacheService._getKeyValidLengthQuery.finalize();
		MiniCacheService._getKeyLengthQuery.finalize();
		MiniCacheService._insertKeyQuery.finalize();
		MiniCacheService._updateKeyQuery.finalize();
		MiniCacheService._deleteKeyQuery.finalize();

		MiniCacheService._db.close();
	},false);
}catch(e){
	info(e);
}