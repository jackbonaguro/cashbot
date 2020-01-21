import AsyncStorage from "@react-native-community/async-storage";

import KeyDerivation from "./keyderivation";
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import Mnemonic from "bitcore-mnemonic";

export default {
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
