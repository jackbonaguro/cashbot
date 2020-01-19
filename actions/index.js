import AsyncStorage from "@react-native-community/async-storage";

import Storage from '../controllers/storage';
import FCM from "../controllers/fcm";
import Api from "../controllers/api";
import KeyDerivation from "../controllers/keyderivation";
import {bitcore as Bitcore} from "bitcore-mnemonic/lib/mnemonic";

export const setEmail = email => ({
  type: 'SET_EMAIL',
  email
});

export const setReceiveXPub = receiveXPub => ({
  type: 'SET_RECEIVE_XPUB',
  receiveXPub
});
export const setReceiveIndex = (receiveIndex, seed) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_RECEIVE_INDEX',
      receiveIndex
    });
  };
};
export const setReceiveAddress = receiveAddress => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_RECEIVE_ADDRESS',
      receiveAddress
    });
  };
};

export const setSigningXPriv = signingXPriv => {
  return {
    type: 'SET_SIGNING_XPRIV',
    signingXPriv
  };
};
export const setSigningIndex = signingIndex => {
  return {
    type: 'SET_SIGNING_INDEX',
    signingIndex
  };
};
export const setSigningAddress = signingAddress => {
  return {
    type: 'SET_SIGNING_ADDRESS',
    signingAddress
  };
};

export const setSeed = seed => {
  return {
    type: 'SET_SEED',
    seed
  };
};

export const fetchReceiveIndex = (seed) => {
  return async (dispatch) => {
    dispatch(setReceiveIndex());
    dispatch(setReceiveAddress());
    dispatch({
      type: 'SET_TEST_SIG'
    });
    Storage.fetchReceiveIndex().then((index) => {
      dispatch(setReceiveIndex(index, seed));
      //dispatch(setTestSig(seed, index));
      KeyDerivation.deriveReceiveAddress(seed, index).then(address => {
        dispatch(setReceiveAddress(address));
      }).catch(console.error);
    }).catch(console.error);
  };
};
export const incrementReceiveIndex = (seed, receiveIndex) => {
  return (dispatch) => {
    dispatch(setReceiveIndex());
    dispatch(setReceiveAddress());
    new Promise((resolve) => {
      const crypto = require('crypto');
      let i;
      console.log('D');
      for (i = 0; i < 100; i++) {
        //console.log('IN');
        const alice = crypto.createDiffieHellman(32);
      }
      console.log('E');
      return resolve();
    })
    //example()
    .then(() => {
      dispatch(setReceiveIndex(receiveIndex + 1));
      dispatch(setReceiveAddress('1234'));
    });
  };
};
export const resetReceiveIndex = (seed) => {
  return (dispatch) => {
    dispatch(setReceiveIndex());
    dispatch(setReceiveAddress());
    dispatch({
      type: 'SET_TEST_SIG'
    });
    Storage.saveReceiveIndex(0).then(() => {
      dispatch(setReceiveIndex(0, seed));
      //dispatch(setTestSig(seed, 0));
      KeyDerivation.deriveReceiveAddress(seed, 0).then(address => {
        dispatch(setReceiveAddress(address));
      }).catch(console.error);
    }).catch(console.error);
  };
};

export const fetchSigningIndex = (seed) => {
  return async (dispatch) => {
    dispatch(setSigningIndex());
    dispatch(setSigningAddress());
    console.log('fetchSigningIndex');
    /*Storage.fetchSigningIndex.then((index) => {
      dispatch(setSigningIndex(index));
      KeyDerivation.deriveSigningAddress(seed, index).then(address => {
        dispatch(setReceiveAddress(address));
      }).catch(console.error);
    });*/
  };
};

export const deriveAndSetSigningXPriv = (seed) => {
  return async (dispatch) => {
    KeyDerivation.deriveSigningXPriv(seed).then(xpriv => {
      dispatch(setSigningXPriv(xpriv));
    }).catch(console.error);
  };
};

export const setTestSig = (seed, index) => {
  return async (dispatch) => {
    KeyDerivation.signReceiveMessage(seed, index, 'Hello, World!!').then(testSig => {
      dispatch({
        type: 'SET_TEST_SIG',
        testSig
      });
    }).catch(console.error);
  };
};

export const fetchSeed = () => {
  return (dispatch) => {
    dispatch(setSeed());
    dispatch(setReceiveIndex());
    dispatch(setSigningIndex());
    dispatch(setReceiveAddress());
    dispatch(setSigningAddress());
    Storage.fetchSeed().then((seed) => {
      dispatch(setSeed(seed));
      dispatch(fetchReceiveIndex(seed));
      dispatch(fetchSigningIndex(seed));
      dispatch(deriveAndSetSigningXPriv(seed));
    });
  };
};
export const generateSeed = () => {
  return (dispatch) => {
    KeyDerivation.generateSeedAsync(() => {
      dispatch(setSeed());
    }, (seed) => {
      Storage.saveSeed(seed).then(() => {
        dispatch(setSeed(seed));
        dispatch(setReceiveIndex(0));
      });
    })
  };
};
export const deleteSeed = () => {
  return (dispatch) => {
    Storage.deleteSeed().then(() => {
      dispatch(setSeed());
      dispatch(setReceiveIndex(0));
    });
  };
};



export const addMessage = (message) => {
  return {
    type: 'ADD_MESSAGE',
    message
  }
};

export const addNotification = (notification) => {
  return {
    type: 'ADD_NOTIFCATION',
    notification
  }
};

export const setFCMToken = (fcmToken) => {
  return {
    type: 'SET_FCM_TOKEN',
    fcmToken
  };
};
