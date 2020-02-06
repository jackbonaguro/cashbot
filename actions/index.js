import Storage from '../controllers/storage';
import CryptoThread from "../controllers/cryptothread";

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
      dispatch(setTestSig(seed, index));
      CryptoThread.deriveReceiveAddress(seed, index).then(address => {
        dispatch(setReceiveAddress(address));
      }).catch(console.error);
    }).catch(console.error);
  };
};
export const incrementReceiveIndex = (seed, receiveIndex) => {
  return (dispatch) => {
    dispatch(setReceiveIndex());
    dispatch(setReceiveAddress());
    dispatch({
      type: 'SET_TEST_SIG'
    });
    Storage.saveReceiveIndex(receiveIndex + 1).then(() => {
      dispatch(setReceiveIndex(receiveIndex + 1, seed));
      dispatch(setTestSig(seed, receiveIndex + 1));
      CryptoThread.deriveReceiveAddress(seed, receiveIndex + 1).then(address => {
        dispatch(setReceiveAddress(address));
      }).catch(console.error);
    }).catch(console.error);
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
      dispatch(setTestSig(seed, 0));
      CryptoThread.deriveReceiveAddress(seed, 0).then(address => {
        dispatch(setReceiveAddress(address));
      }).catch(console.error);
    }).catch(console.error);
  };
};

export const fetchSigningIndex = (seed) => {
  return async (dispatch) => {
    dispatch(setSigningIndex());
    dispatch(setSigningAddress());
    Storage.fetchSigningIndex().then((index) => {
      dispatch(setSigningIndex(index));
      CryptoThread.deriveSigningAddress(seed, index).then(address => {
        dispatch(setReceiveAddress(address));
      }).catch(console.error);
    });
  };
};

export const deriveAndSetSigningXPriv = (seed) => {
  return async (dispatch) => {
    CryptoThread.deriveSigningXPriv(seed).then(xpriv => {
      dispatch(setSigningXPriv(xpriv));
    }).catch(console.error);
  };
};

export const setTestSig = (seed, index) => {
  return async (dispatch) => {
    CryptoThread.signReceiveMessage(seed, index, 'Hello, World!!').then(testSig => {
      dispatch({
        type: 'SET_TEST_SIG',
        testSig
      });
    }).catch(console.error);
  };
};

export const generateSeed = () => {
  return (dispatch) => {
    CryptoThread.generateSeed(() => {
      dispatch(setSeed());
    }).then((seed) => {
      dispatch(setSeed(seed));
    })
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

// New SQL Actions
export const registerAccount = (email) => {
  return (dispatch) => {
    Storage.insertUser(email, 0).then((id) => {
      console.log(id);
      return dispatch({
        type: 'SET_USER',
        id,
        email
      });
    }).catch(console.error);
  };
};

export const setMasterKey = (xpriv) => {
  return (dispatch) => {
    Storage.insertKey(xpriv, null, null, null).then((id) => {
      Storage.setUserMasterKey(email, id).then((results) => {
        return {
          type: 'SET_MASTER_KEY',
          id,
          xpriv
        }
      });
    });
  };
};

export const fetchUser = () => {
  return (dispatch) => {
    Storage.getDefaultUser().then((res) => {
      if (res.length) {
        let item = res.item(0);
        console.log(item);
        dispatch({
          type: 'SET_USER',
          id: item.id,
          email: item.email
        });
        let masterKeyId = res.item(0).masterkeyid;
        if (masterKeyId === 0) {
          return;
        }
        Storage.getKey(masterKeyId).then((res) => {
          if (!res.length) {
            return console.error('MasterKeyId set but no key found!');
          }
          dispatch({
            type: 'SET_MASTER_KEY',
            id: masterKeyId,
          });
        });
      } else {
        console.log('No stored user');
        return dispatch({
          type: 'SET_USER'
        });
      }
    });
  };
};
