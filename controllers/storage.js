import AsyncStorage from "@react-native-community/async-storage";

import KeyDerivation from "./keyderivation";
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import Mnemonic from "bitcore-mnemonic";
import SQLite from 'react-native-sqlite-storage';

let db;

const insertSQL = async (query) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Create all tables if needed
      tx.executeSql(query, [], (tx, res) => {
        if (!res.insertId) {
          return reject(new Error('No insertId for query: ' + query));
        }
        return resolve(res.insertId);
      }, (tx, err) => {
        return reject(err);
      });
    }, (err) => {
      return reject(err);
    });
  });
};

const selectSQL = async(query) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Create all tables if needed
      tx.executeSql(query, [], (tx, res) => {
        if (!res.rows) {
          return reject(new Error('No return value for query: ' + query));
        }
        return resolve(res.rows);
      }, (tx, err) => {
        return reject(err);
      });
    }, (err) => {
      return reject(err);
    });
  });
};

const updateSQL = async(query) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Create all tables if needed
      tx.executeSql(query, [], (tx, res) => {
        if (!res.insertId) {
          return reject(new Error('No updateId for query: ' + query));
        }
        return resolve(res.insertId);
      }, (tx, err) => {
        return reject(err);
      });
    }, (err) => {
      return reject(err);
    });
  });
};

const deleteSQL = async(query) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Create all tables if needed
      tx.executeSql(query, [], (tx, res) => {
        if (!res.insertId) {
          return reject(new Error('No removeId for query: ' + query));
        }
        return resolve(res.insertId);
      }, (tx, err) => {
        return reject(err);
      });
    }, (err) => {
      return reject(err);
    });
  });
};

export default {
  initializeStorage: async () => {
    return new Promise((resolve, reject) => {
      db = SQLite.openDatabase({name: 'test.db', location : "default"}, resolve, reject);
    }).then(() => {
      db.transaction((tx) => {
        // Create all tables if needed
        tx.executeSql('CREATE TABLE IF NOT EXISTS keys (id INTEGER PRIMARY KEY AUTOINCREMENT, xpriv TEXT, xpub TEXT, address TEXT, label TEXT);');
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, masterkeyid INTEGER, FOREIGN KEY(masterkeyid) REFERENCES keys(id));');
        tx.executeSql('CREATE TABLE IF NOT EXISTS keytree (id INTEGER PRIMARY KEY AUTOINCREMENT, parentid INTEGER, childid INTEGER, path TEXT, FOREIGN KEY(parentid) REFERENCES keys(id), FOREIGN KEY(childid) REFERENCES keys(id));');
        tx.executeSql('CREATE TABLE IF NOT EXISTS preferences (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT, userid INTEGER, FOREIGN KEY(userid) REFERENCES users(id));');
        tx.executeSql('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, data TEXT, userid INTEGER, FOREIGN KEY(userid) REFERENCES users(id));');
      }, (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
      }, () => {
        // All good
        console.log('All good');
        return db;
      });
    });
  },
  saveReceiveIndex: (index) => {
    return new Promise((resolve, reject) => {
      const keyIndex = 0;
      AsyncStorage.setItem(`RECEIVE-${keyIndex}/INDEX`, `${index}`).then(() => {
        return resolve();
      }).catch(reject);
    });
  },
  fetchReceiveIndex: () => {
    return new Promise((resolve, reject) => {
      const keyIndex = 0;
      try {
        AsyncStorage.getItem(`RECEIVE-${keyIndex}/INDEX`).then(value => {
          let index;
          if (value !== null) {
            // value previously stored
            index = parseInt(value);
          } else {
            index = 0;
          }
          return resolve(index);
        });
      } catch (err) {
        return reject(err);
      }
    });
  },
  fetchSigningIndex: () => {
    return new Promise((resolve, reject) => {
      const keyIndex = 0;
      try {
        AsyncStorage.getItem(`SIGNING-${keyIndex}/INDEX`).then(value => {
          let index;
          if (value !== null) {
            // value previously stored
            index = parseInt(value);
          } else {
            index = 0;
          }
          return resolve(index);
        });
      } catch (err) {
        return reject(err);
      }
    });
  },
  saveSigningIndex: (index) => {
    return new Promise((resolve, reject) => {
      const keyIndex = 0;
      AsyncStorage.setItem(`SIGNING-${keyIndex}/INDEX`, `${index}`).then(resolve).catch(reject);
    });
  },
  fetchSeed: () => {
    return new Promise((resolve, reject) => {
      const keyIndex = 0;
      RNSecureKeyStore.get(`KEY-${keyIndex}`).then((res) => {
        return resolve(new Mnemonic(res, Mnemonic.Words.ENGLISH));
      }).catch((err) => {
        if (err && err.code && err.code === '404') {
          // 404 comes from filesystem server, means no file exists at this path.
          // For now we just set mnemonic back to null.
          return resolve(null);
        }
        return reject(err);
      });
    });
  },
  saveSeed: (mnemonic) => {
    return new Promise((resolve, reject) => {
      const keyIndex = 0;
      RNSecureKeyStore.set(
          `SEED-${keyIndex}`,
          mnemonic.toString(),
          { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY }
        ).then(resolve).catch(reject);
    });
  },
  deleteSeed: () => {
    return new Promise((resolve, reject) => {
      const keyIndex = 0;
      RNSecureKeyStore.remove(`SEED-${keyIndex}`)
        .then(resolve).catch(reject);
    });
  },
  // New -- SQLite functions
  insertUser: async (email, masterKeyId) => {
    return await insertSQL('INSERT INTO users (email, masterkeyid) VALUES ("' + email + '", ' + masterKeyId + ');');
  },
  insertKey: async (xpriv, xpub, address, label) => {
    if (!xpriv) {
      xpriv = '';
    }
    if (!xpub) {
      xpub = '';
    }
    if (!address) {
      address = '';
    }
    if (!label) {
      label = '';
    }
    return await insertSQL('INSERT INTO keys (xpriv, xpub, address, label) VALUES ("' + xpriv + '", "' + xpub + '", "' + address + '", "' + label + '");');
  },
  insertKeyLink: async (parentKeyId, childKeyId, path) => {
    return await insertSQL('INSERT INTO keytree (parentid, childid, path) VALUES (' + parentKeyId + ', ' + childKeyId + ', "' + path + '");');
  },
  insertPreference: async (key, value, userId) => {
    return await insertSQL('INSERT INTO preferences (key, value, userid) VALUES ("' + key + '", "' + value + '", ' + userId + ');');
  },
  insertEvent: async (type, data, userId) => {
    return await insertSQL('INSERT INTO events (type, data, userid) VALUES ("' + type + '", "' + data + '", ' + userId + ');');
  },
  getUser: async (email) => {
    return await selectSQL('SELECT * FROM users WHERE email = "' + email + '";');
  },
  getDefaultUser: async () => {
    return await selectSQL('SELECT * FROM users;');
  },
  getKey: async (keyId) => {
    return await selectSQL('SELECT * FROM keys WHERE id = "' + keyId + '";');
  },
  getKeyIndex: async (parentId) => {
    // Use the signingXPub to get the count of saved keys
    return await selectSQL('SELECT * FROM keytree WHERE parentid = "' + parentId + '";');
  },
  getReceiveXPub: async () => {
    return await selectSQL('SELECT * FROM keys WHERE label = "receiveXPub";');
  },
  setUserMasterKey: async (email, id) => {
    return await updateSQL('UPDATE users SET masterkeyid = ' + masterKey + ' WHERE email = "' + email + '";');
  },
};
