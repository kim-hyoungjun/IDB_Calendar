/*!
 * indexedDB Plugin v0.1
 * License: https://github.com/ParkMinKyu/diary/blob/master/LICENSE
 * (c) 2018
 */

var IDB = {
	indexedDB : window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
	IDBKeyRange : window.IDBKeyRange || window.webkitIDBKeyRange,
	schemaName: "Schedule",
	dbName: "decoyCalendar",
	isSupport: false,
	dbVersion:1,

	checkDB : function() {
		if (!this.indexedDB) {
			if(isDebug) console.log("IndexedDB를 지원하지 않는 브라우저");
		} else{
			if(isDebug) console.log("indexedDB 지원");
			this.isSupport = true;
		}
	},

	getConnection : function() {
		var database = this.indexedDB.open(this.dbName, this.dbVersion);
        database.onupgradeneeded = function(e) {
					if(isDebug) console.log("Upgrading...");

					var thisDB = e.target.result;
					if(! thisDB.objectStoreNames.contains(IDB.schemaName)) {
						var store = thisDB.createObjectStore(IDB.schemaName, {keyPath:'id',autoIncrement:true});
								store.createIndex("id", "id", {unique:true});
								store.createIndex("end", "end", {unique:false});
								store.createIndex("start", "start", {unique:false});
					}
        }

        database.onsuccess = function(e) {
					if(isDebug) console.log("데이터베이스 연결 성공");
        }

        database.onerror = function(e) {
					if(isDebug) console.log("데이터베이스 연결 실패");
					console.dir(e);
        }

		return database;
	},

	selectAll : function(callback) {
		var database = this.getConnection();
				database.onsuccess = function() {
					var db = database.result;
					var tx = db.transaction(IDB.schemaName, "readonly");
							tx.oncomplete = function() {
								db.close();
					    };

					var store = tx.objectStore(IDB.schemaName);
					var data = store.getAll();
							data.onsuccess = function() {
								if(isDebug) console.dir(data.result.length);
								callback(data.result);
							}
				}

				database.onerror = function(event) {
					callback(event);
				}
	},

	selectRange : function(start, end, callback) {
		var result = [];
		var database = this.getConnection();
				database.onsuccess = function() {
					var db = database.result;
					var tx = db.transaction(IDB.schemaName, "readonly");
							tx.oncomplete = function() {
								db.close();
					    };

					var range = IDBKeyRange.bound(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
					// 시작일자가 범위에 있는 데이터를 추출
					var index = tx.objectStore(IDB.schemaName).index("start");
							index.openCursor(range).onsuccess = function(event) {
								var cursor = event.target.result;
								if (cursor) {
									result.push(cursor.value);
									cursor.continue();
								} else {
									// 종료일자가 범위에 있는 데이터를 추출
									index = tx.objectStore(IDB.schemaName).index("end");
									index.openCursor(range).onsuccess = function(event) {
										var cursor = event.target.result;
										if (cursor) {
											var notExist = true;
											for(var i = 0 ; i < result.length ; i ++){
												if (cursor.value.id == result[i].id) {
													notExist = false;
													break;
												}
											}
											if (notExist) {
												result.push(cursor.value);
											}

											cursor.continue();
										} else {
											callback(result);
										}
									}
								}
							}
				}
				database.onerror = function(event) {
					callback(event);
				}
	},

	selectOne : function(id,callback) {
		var database = this.getConnection();
				database.onsuccess = function() {
					var db = database.result;
					var tx = db.transaction(IDB.schemaName, "readonly");
							tx.oncomplete = function() {
								db.close();
							};
					var store = tx.objectStore(IDB.schemaName);
					var data = store.get(id);
							data.onsuccess = function() {
								callback(data.result);
							}
				}

				database.onerror = function(event) {
					callback(event);
				}
		},

	insert: function(val, callback) {
		var database = this.getConnection();
				database.onsuccess = function() {
					var db = database.result;
					var tx = db.transaction(IDB.schemaName, "readwrite");
							tx.oncomplete = function() {
								db.close();
							};
					var store = tx.objectStore(IDB.schemaName);
					var request = store.add(val);
							request.onerror = function(e) {
								if(isDebug) console.log ("Error", e.target.error.name);
							}
							request.onsuccess = function(e) {
								if(isDebug) console.log ("데이터가 추가 되었습니다.");
								callback(1);
							}
				}

				database.onerror = function(event) {
					callback(event);
				}
	},

	update: function(val, callback) {
		var database = this.getConnection();
				database.onsuccess = function() {
					var db = database.result;
					var tx = db.transaction(IDB.schemaName, "readwrite");
							tx.oncomplete = function() {
								db.close();
					    };

					var range = IDBKeyRange.only(val.id);
					// 시작일자가 범위에 있는 데이터를 추출
					var index = tx.objectStore(IDB.schemaName).index("id");
							index.openCursor(range).onsuccess = function(event) {
								var cursor = event.target.result;
								if (cursor) {
									cursor.value.title	= val.title;
									cursor.value.allDay	= val.allDay;
									cursor.value.start	= val.start;
									cursor.value.end		= val.end;
									cursor.value.surl		= val.surl;
									
									var result = cursor.update(cursor.value);
											result.onsuccess = function() {
												if(isDebug) console.log ("데이터가 수정추가 되었습니다.");
												callback(1);
											}
											result.onerror = function(e) {
												if(isDebug) console.log ("수정 오류 : " + e);
											}
								}
							}
				}

				database.onerror = function(event) {
					callback(event);
				}
	},

	delete: function(id, callback) {
		var database = this.getConnection();
			database.onsuccess = function() {
				var db = database.result;
				var tx = db.transaction(IDB.schemaName, "readwrite");
						tx.oncomplete = function() {
							db.close();
							callback(1);
						};
				var store = tx.objectStore(IDB.schemaName);
						store.delete(id);
			}

			database.onerror = function(event) {
				callback(event);
			}
	}
};