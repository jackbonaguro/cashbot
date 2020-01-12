import { combineReducers } from 'redux';

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_EMAIL': {
      return {
        ...state,
        email: action.email,
      };
    }
    case 'SET_SEED': {
      return {
        ...state,
        seed: action.seed,
      };
    }
    case 'SET_RECEIVE_INDEX': {
      return {
        ...state,
        receiveIndex: action.receiveIndex,
      };
    }
    case 'SET_SIGNING_INDEX': {
      return {
        ...state,
        signingIndex: action.signingIndex,
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
      console.log(state.messages);
      let messages = state.messages;
      if (!messages) {
        messages = [action.message];
      } else {
        messages.push(action.message);
      }
      console.log(messages);
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
