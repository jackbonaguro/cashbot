import AsyncStorage from "@react-native-community/async-storage";

import KeyDerivation from "./keyderivation";
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import Mnemonic from "bitcore-mnemonic";
import SQLite from 'react-native-sqlite-storage';

let db;

export default {
  initializeStorage: async () => {
    new Promise((resolve, reject) => {
      db = SQLite.openDatabase({name: 'test.db', location : "default"}, resolve, reject);
    }).then(() => {
      db.transaction((tx) => {
        // Create all tables if needed
        tx.executeSql('CREATE TABLE IF NOT EXISTS wallets (id INTEGER PRIMARY KEY AUTOINCREMENT, seed TEXT);');
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT);');
        tx.executeSql('CREATE TABLE IF NOT EXISTS preferences (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT);');
        tx.executeSql('CREATE TABLE IF NOT EXISTS addresses (id INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT);');
        //
        tx.executeSql('CREATE TABLE IF NOT EXISTS wallet_address (id INTEGER PRIMARY KEY AUTOINCREMENT, addressid INTEGER, walletid INTEGER, FOREIGN KEY(addressid) REFERENCES addresses(id), FOREIGN KEY(walletid) REFERENCES wallets(id));');
        tx.executeSql('CREATE TABLE IF NOT EXISTS user_wallet (id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER, walletid INTEGER, FOREIGN KEY(userid) REFERENCES users(id), FOREIGN KEY(walletid) REFERENCES wallets(id));');
        tx.executeSql('CREATE TABLE IF NOT EXISTS user_preference (id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER, preferenceid INTEGER, FOREIGN KEY(userid) REFERENCES users(id), FOREIGN KEY(preferenceid) REFERENCES preferences(id));');
      }, (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
      }, () => {
        // All good
        console.log('All good');
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
  }
}
