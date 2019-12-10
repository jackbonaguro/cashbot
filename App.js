import React from 'react';
import {
  StyleSheet,
  Platform,
  TextInput,
  Text,
  View,
  ScrollView,
  FlatList,
  Button,
} from 'react-native';

import firebase, { Notification, RemoteMessage } from 'react-native-firebase';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fcmToken: '',
      apiResponse: '',
      notifications: [],
    };
    console.log('App');
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    //const { user } = await firebase.auth().signInAnonymously();
    //console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});
    try {
      //let apiResponse = await fetch('https://api.bitcore.io/');
      //console.log(`ApiResponse: ${apiResponse}`);

      fetch('https://api.bitcore.io/').then((apiResponse) => {
        console.log(`ApiResponse: ${apiResponse}`);
        firebase.messaging().getToken().then((fcmToken) => {
          console.log(`FCMToken: ${fcmToken}`);
          this.setState({
            fcmToken,
            apiResponse: JSON.stringify(apiResponse),
          });
        }).catch(console.error);
      }).catch(console.error);
    } catch (e) {
      console.error(e);
    }

    if (Platform.OS === 'android') {
      try {
        const res = await firebase.messaging().requestPermission();
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
          console.log('FCM Token: ', fcmToken);
          const enabled = await firebase.messaging().hasPermission();
          if (enabled) {
            console.log('FCM messaging has permission:' + enabled)
          } else {
            try {
              await firebase.messaging().requestPermission();
              console.log('FCM permission granted')
            } catch (error) {
              console.error('FCM Permission Error', error);
            }
          }
          firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            console.log('Notification: ', notification);
          });
          this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            console.log('Notification.title: ', notification.title);
            console.log('Notification.body: ', notification.body);
            console.log('Notification.id: ', notification.notificationId);
            this.setState({
              notifications: [
                ...(this.state.notifications),
                {
                  title: notification.title,
                  body: notification.body,
                  id: notification.notificationId,
                }
              ],
            })
          });
        } else {
          console.warn('FCM Token not available');
        }
      } catch (e) {
        console.error('Error initializing FCM', e);
      }
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {/*<Image source={require('./assets/ReactNativeFirebase.png')} style={[styles.logo]}/>*/}
          <Text style={styles.welcome}>
            Cashbot
          </Text>
          <Text>FCMToken: </Text>
          <TextInput style={styles.instructions}>
            {`${this.state.fcmToken}`}
          </TextInput>
          <Text>{`ApiResponse: ${this.state.apiResponse}`}</Text>
          <Button title={'Log'} onPress={() => {
            console.log('Press');
            console.warn('Warning');
          }} />
        </View>
        <FlatList
          data={this.state.notifications}
          extraData={this.state}
          renderItem={({ item: n }) => {
            console.log(n);
            const title = n.title;
            const body = n.body;
            const id = n.id;
            return (
              <View style={{
                padding: 10,
              }}>
                <Text>{`Name: ${title}`}</Text>
                <Text>{`Body: ${body}`}</Text>
                <Text>{`ID: ${id}`}</Text>
              </View>
            );
          }}
          keyExtractor={n => n.id}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5ECFF',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
