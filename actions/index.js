import Storage from '../controllers/storage';
import fcm from "../controllers/fcm";
// import KeyDerivation from "../keyderivation";

export const setEmail = email => ({
  type: 'SET_EMAIL',
  email
});

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

export const setSeed = seed => {
  return {
    type: 'SET_SEED',
    seed
  };
};

export const fetchReceiveIndex = () => {
  return (dispatch) => {
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
}
