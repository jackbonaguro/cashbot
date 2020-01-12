import Storage from '../controllers/storage';
import FCM from "../controllers/fcm";
import Api from "../controllers/api";
import KeyDerivation from "../controllers/keyderivation";

export const setEmail = email => {
  return async (dispatch) => {
    setTimeout(() => {
      dispatch({
        type: 'SET_EMAIL',
        email
      });
    }, 2000);
  };
};

export const setReceiveXPub = receiveXPub => ({
  type: 'SET_RECEIVE_XPUB',
  receiveXPub
});

export const setReceiveIndex = receiveIndex => {
  return {
    type: 'SET_RECEIVE_INDEX',
    receiveIndex
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

export const setSeed = seed => {
  return {
    type: 'SET_SEED',
    seed
  };
};

export const fetchReceiveIndex = () => {
  return async (dispatch) => {
    Storage.fetchReceiveIndexAsync(() => {
      dispatch(setReceiveIndex());
    }, (index) => {
      dispatch(setReceiveIndex(index));
    });
  };
};
export const incrementReceiveIndex = (receiveIndex) => {
  return (dispatch) => {
    dispatch(setReceiveIndex());
    Storage.saveReceiveIndex(receiveIndex + 1).then(() => {
      dispatch(setReceiveIndex(receiveIndex + 1));
    }).catch(console.error);
  };
};
export const resetReceiveIndex = () => {
  return (dispatch) => {
    dispatch(setReceiveIndex());
    Storage.saveReceiveIndex(0).then(() => {
      dispatch(setReceiveIndex(0));
    }).catch(console.error);
  };
};

export const fetchSigningIndex = () => {
  return async (dispatch) => {
    Storage.fetchSigningIndexAsync(() => {
      dispatch(setSigningIndex());
    }, (index) => {
      dispatch(setSigningIndex(index));
    });
  };
};

export const deriveAndSetSigningXPriv = (seed) => {
  return async (dispatch) => {
    const xpriv = KeyDerivation.deriveSigningXPriv(seed);
    dispatch(setSigningXPriv(xpriv));
  };
};

export const fetchSeed = () => {
  return (dispatch) => {
    Storage.fetchSeedAsync(() => {
      dispatch(setSeed());
    }, (seed) => {
      dispatch(setSeed(seed));
    });
  };
};
export const generateSeed = () => {
  return (dispatch) => {
    KeyDerivation.generateSeedAsync(() => {
      dispatch(setSeed());
    }, (seed) => {
      Storage.saveSeed(seed, () => {
        dispatch(setSeed(seed));
        dispatch(setReceiveIndex(0));
      });
    })
  };
};
export const deleteSeed = () => {
  return (dispatch) => {
    Storage.deleteSeed(() => {
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
