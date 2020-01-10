import React from 'react';
import {
  View,
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
import Account from './components/Account';
import TabBar from './components/TabBar';
import styles from './styles';

//const store = createStore(rootReducer);
import store from './store';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter style={{
            height: Dimensions.get('window').height,
          }}>
          <View style={styles.appContainer}>
            <Switch style={{flex:1}}>
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
              <Route
                path="/account"
                render={(props) => (
                  <Account {...props} />
                )}
              />
            </Switch>
            <TabBar />
          </View>
        </NativeRouter>
      </Provider>
    );
  }
}

export default App;
