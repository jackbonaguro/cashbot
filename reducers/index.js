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
    default: {
      return state;
    }
  }
};

export default combineReducers({
  userReducer,
});
