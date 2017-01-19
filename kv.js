(function() {
  'use strict';
  var db;

  var DB_NAME = 'kv';
  var STORE_NAME = 'kv';
  var TRANS_RO = 'readonly';
  var TRANS_RW = 'readwrite';

  function getDB() {
    if (!db) {
      db = new Promise(function(resolve, reject) {
        var openreq = indexedDB.open(DB_NAME, 1);

        openreq.onerror = function() {
          reject(openreq.error);
        };

        openreq.onupgradeneeded = function() {
          // First time setup: create an empty object store
          openreq.result.createObjectStore(STORE_NAME);
        };

        openreq.onsuccess = function() {
          resolve(openreq.result);
        };
      });
    }
    return db;
  }

  function withStore(type, callback) {
    return getDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction(STORE_NAME, type);
        transaction.oncomplete = function() {
          resolve();
        };
        transaction.onerror = function() {
          reject(transaction.error);
        };
        callback(transaction.objectStore(STORE_NAME));
      });
    });
  }

  var kv = {
    get: function(key) {
      var req;
      return withStore(TRANS_RO, function(store) {
        req = store.get(key);
      }).then(function() {
        return req.result;
      });
    },
    set: function(key, value) {
      return withStore(TRANS_RW, function(store) {
        store.put(value, key);
      });
    },
    remove: function(key) {
      return withStore(TRANS_RW, function(store) {
        store.delete(key);
      });
    },
    clear: function() {
      return withStore(TRANS_RW, function(store) {
        store.clear();
      });
    },
    keys: function() {
      var keys = [];
      return withStore(TRANS_RO, function(store) {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function() {
          if (!this.result) return;
          keys.push(this.result.key);
          this.result.continue();
        };
      }).then(function() {
        return keys;
      });
    }
  };

  if (typeof module != 'undefined' && module.exports) {
    module.exports = kv;
  } else if (typeof define === 'function' && define.amd) {
    define('kv', [], function() {
      return kv;
    });
  } else {
    self.kv = kv;
  }
}());
