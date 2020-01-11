import Storage from '../storage';
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
  }
};

export const setSeed = seed => {
  return {
    type: 'SET_SEED',
    seed
  }
};

export const fetchReceiveIndex = () => {
  return (dispatch) => {
    console.log('prefetch');
    Storage.fetchReceiveIndexAsync(() => {
      dispatch(setReceiveIndex());
    }, (index) => {
      console.log('postfetch' + index);
      dispatch(setReceiveIndex(index));
    });
  }
};

export const fetchSeed = () => {
  return (dispatch) => {
    Storage.fetchSeedAsync(() => {
      dispatch(setSeed());
    }, (seed) => {
      dispatch(setSeed(seed));
    });
  }
};

export const generateSeed = () => {
  return (dispatch) => {
    KeyDerivation.generateSeedAsync(() => {
      dispatch(setSeed());
    }, (seed) => {
      dispatch(setSeed(seed));
    })
  }
};
