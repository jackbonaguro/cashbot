/**
 * @format
 */

import './shim.js'
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import App from './App';
import { name as appName } from './app.json';

import backgroundMessageHandler from './backgroundMessageHandler';

const store = createStore(rootReducer);

AppRegistry.registerComponent(appName, () => (
  <Provider store={store}>
    <App />
  </Provider>
));
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundMessageHandler);
