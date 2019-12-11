/**
 * @format
 */

import './shim.js'
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import backgroundMessageHandler from './backgroundMessageHandler';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundMessageHandler);
