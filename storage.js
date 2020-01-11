import AsyncStorage from "@react-native-community/async-storage";

import KeyDerivation from "./keyderivation";
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import Mnemonic from "bitcore-mnemonic";

export default Storage = {
  // thunk
  fetchReceiveIndexAsync: async (beforeCallback, afterCallback) => {
    const keyIndex = 0;
    beforeCallback();
    try {
      const value = await AsyncStorage.getItem(`KEY-${keyIndex}/INDEX`);
      let index;
      if (value !== null) {
        // value previously stored
        index = parseInt(value);
      } else {
        index = 0;
      }
      afterCallback(index);
    } catch (e) {
      console.error(e);
    }
  },
  saveReceiveIndex: async (index) => {
    const keyIndex = 0;
    try {
      await AsyncStorage.setItem(`KEY-${keyIndex}/INDEX`, `${index}`);
    } catch (e) {
      console.error(e);
    }
  },
  fetchSeedAsync: async (beforeCallback, afterCallback) => {
    const keyIndex = 0;
    beforeCallback();
    RNSecureKeyStore.get(`KEY-${keyIndex}`)
      .then((res) => {
        afterCallback(new Mnemonic(res, Mnemonic.Words.ENGLISH));
      }, (err) => {
        if (err && err.code && err.code === '404') {
          // 404 comes from filesystem server, means no file exists at this path.
          // For now we just set mnemonic back to null.
          afterCallback(null);
        } else {
          console.warn(err);
        }
      });
  },
  saveSeed: (mnemonic, callback) => {
    const keyIndex = 0;
    RNSecureKeyStore.set(`KEY-${keyIndex}`, mnemonic.toString(), { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY })
      .then((res) => {
        callback(res);
      }, (err) => {
        console.warn(err);
      });
  },
  deleteSeed: (callback) => {
    const keyIndex = 0;
    RNSecureKeyStore.remove(`KEY-${keyIndex}`)
      .then((res) => {
        callback(res);
      }, (err) => {
        console.warn(err);
      });
  }
}
