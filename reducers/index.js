import { combineReducers } from 'redux';

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_EMAIL': {
      return {
        ...state,
        email: action.email,
      };
    }
    case 'SET_RECEIVE_INDEX': {
      return {
        ...state,
        receiveIndex: action.receiveIndex,
      };
    }
    case 'SET_RECEIVE_ADDRESS': {
      return {
        ...state,
        receiveAddress: action.receiveAddress,
      };
    }
    case 'SET_SIGNING_INDEX': {
      return {
        ...state,
        signingIndex: action.signingIndex,
      };
    }
    case 'SET_TEST_SIG': {
      return {
        ...state,
        testSig: action.testSig
      };
    }
    case 'SET_SIGNING_ADDRESS': {
      return {
        ...state,
        signingAddress: action.signingAddress,
      };
    }
    case 'SET_SIGNING_XPRIV': {
      return {
        ...state,
        signingXPriv: action.signingXPriv,
      };
    }
    // New SQL Routes
    case 'SET_USER': {
      return {
        ...state,
        user: {
          id: action.id,
          email: action.email,
          keys: [],
          preferences: {}
        },
      };
    }
    case 'SET_MASTER_KEY': {
      return {
        ...state,
        user: {
          ...state.user,
          masterKey: action.id,
          keys: [
            ...state.keys,
            {
              id: action.id,
              xpriv: action.xpriv
            }
          ]
        },
      };
    }
    default: {
      return state;
    }
  }
};

const messageReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      let messages = state.messages;
      if (!messages) {
        messages = [action.message];
      } else {
        messages.push(action.message);
      }
      return {
        ...state,
        messages
      };
    }
    case 'ADD_NOTIFICATION': {
      let notifications = state.notifications;
      if (!notifications) {
        notifications = [action.notification];
      } else {
        notifications.push(action.notification);
      }
      return {
        ...state,
        notifications
      };
    }
    case 'SET_FCM_TOKEN': {
      return {
        ...state,
        fcmToken: action.fcmToken
      };
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({
  userReducer,
  messageReducer,
});
