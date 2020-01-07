import { combineReducers } from 'redux';

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_EMAIL': {
      return {
        ...state,
        email: action.email,
      };
    }
    case 'SET_ADDRESS': {
      return {
        ...state,
        address: action.address,
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