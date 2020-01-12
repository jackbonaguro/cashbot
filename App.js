import React from 'react';
import {
  View,
  Dimensions
} from 'react-native';
import {connect, Provider} from 'react-redux';
import { createStore } from 'redux';
import { NativeRouter, Route, Redirect, Switch } from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';

import { setFCMToken, addNotification, addMessage, incrementReceiveIndex } from './actions';

import Account from './components/Account';
import Account2 from './components/Account2';

import store from './store';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <View>
            <Switch style={{flex:1}}>
              <Redirect exact from="/" to="/account" />
              <Route
                path="/account"
                render={(props) => (
                  <Account {...props} />
                )}
              />
              <Route
                path="/account2"
                render={(props) => (
                  <Account2 {...props} />
                )}
              />
            </Switch>
          </View>
        </NativeRouter>
      </Provider>
    );
  }
}

export default App;
