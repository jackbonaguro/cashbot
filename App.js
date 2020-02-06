import React from 'react';
import {
  View,
  Dimensions
} from 'react-native';
import {connect, Provider} from 'react-redux';
import { createStore } from 'redux';
import { NativeRouter, Route, Redirect, Switch } from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';

import {setFCMToken, addNotification, addMessage, incrementReceiveIndex, fetchSeed} from './actions';

import Keystore from './components/Keystore';
import Status from './components/Status';
import Account from './components/Account';
import Splash from './components/Splash';
import CreateAccount from "./components/CreateAccount";
import CreateWallet from "./components/CreateWallet";
import TabBar from './components/TabBar';
import styles from './styles';

import store from './store';
import FCM from './controllers/fcm';
import CryptoThread from './controllers/cryptothread';
import Api from './controllers/api';
import Storage from './controllers/storage';
import KeyDerivation from './controllers/keyderivation';

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  async componentDidMount() {
    const messageHandler = (message) => {
      let userState = store.getState().userReducer;
      Api.addressRequestHook(KeyDerivation.deriveReceiveAddress(userState.seed, userState.receiveIndex), (err, responseBody) => {
        store.dispatch(addMessage({
          data: message.data,
          id: message.messageId,
        }));
        store.dispatch(incrementReceiveIndex(userState.receiveIndex));
      });
    };

    FCM.initializeFirebase(messageHandler, (notification) => {
      store.dispatch(addNotification({
        title: notification.title,
        body: notification.body,
        id: notification.notificationId,
      }));
    }, (err, { messageListener, notificationListener, fcmToken }) => {
      if (err) {
        console.error(err);
      }
      store.dispatch(setFCMToken(fcmToken));
      this.setState({
        messageListener,
        notificationListener,
      });
    });

    await CryptoThread.initializeCryptoThread();
    //store.dispatch(fetchSeed());
  }

  componentWillUnmount() {
    this.state.notificationListener();
    this.state.messageListener();
  }

  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <View>
            <Switch style={{flex:1}}>
              <Redirect exact from="/" to="/splash" />
              <Route
                path="/splash"
                render={(props) => {
                  return <Splash {...props} />
                }}
              />
              <Route
                path="/createaccount"
                render={(props) => (
                  <CreateAccount {...props} />
                )}
              />
              <Route
                path="/createwallet"
                render={(props) => (
                  <CreateWallet {...props} />
                )}
              />
              <Route
                path="/status"
                render={(props) => (
                  <Status {...props} />
                )}
              />
              <Route
                path="/wallet"
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
          </View>
        </NativeRouter>
      </Provider>
    );
  }
}

export default App;
