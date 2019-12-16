import React from 'react';
import {
  Dimensions
} from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NativeRouter, Route, Redirect, Switch } from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';

import rootReducer from './reducers';
import { setEmail } from './actions';

import Keystore from './components/Keystore';
import Status from './components/Status';
import TabBar from './components/TabBar';
import styles from './styles';

const store = createStore(rootReducer);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter style={[
          styles.appContainer,
          {
            height: Dimensions.get('window').height,
          }
        ]}>
          <Switch>
            <Redirect exact from="/" to="/status" />
            <Route
              path="/status"
              render={(props) => (
                <Status {...props} />
              )}
            />
            <Route
              path="/keystore"
              render={(props) => (
                <Keystore {...props} />
              )}
            />
          </Switch>
          <TabBar />
        </NativeRouter>
      </Provider>
    );
  }
}

export default App;
