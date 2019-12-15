import { combineReducers } from 'redux';

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_EMAIL': {
      return {
        ...state,
        email: action.email,
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