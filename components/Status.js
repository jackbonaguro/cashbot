import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  ScrollView,
  FlatList,
  Button,
} from 'react-native';
import { connect } from 'react-redux';
import { Link } from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';

import { setEmail } from '../actions';

import styles, { pallette } from '../styles';

class Status extends React.Component {
  constructor() {
    super();
    this.state = {
      fcmToken: '',
      notifications: [],
      messages: [],
    };
  }

  async respondToMessage(address) {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3001/respond', {
        method: 'POST',
        body: `{ "address": "${address}" }`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
      }).then(response => response.json()).then(json => {
        return resolve(json);
      }).catch(reject);
    });
  }

  async initializeFCM() {
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
          console.log(notification);
          this.setState({
            notifications: [
              ...(this.state.notifications),
              {
                title: notification.title,
                body: notification.body,
                id: notification.notificationId,
              }
            ],
          });
        });
        // Data message listener
        this.messageListener = firebase.messaging().onMessage((message) => {
          console.log(message);
          this.respondToMessage('5678').then(responseBody => {
            console.log(`responseBody: ${JSON.stringify(responseBody)}`);
            this.setState({
              messages: [
                ...(this.state.messages),
                {
                  data: message.data,
                  id: message.messageId,
                },
              ],
            });
          }).catch(console.error);
        });
      } else {
        console.warn('FCM Token not available');
      }
    } catch (e) {
      console.error('Error initializing FCM', e);
    }
  }

  async componentDidMount() {
    firebase.messaging().getToken().then((fcmToken) => {
      console.log(`FCMToken: ${fcmToken}`);
      this.setState({
        fcmToken,
      });
    }).catch(console.error);

    // if (Platform.OS === 'android') {
    await this.initializeFCM();
    // }
  }

  componentWillUnmount() {
    this.notificationListener();
    this.messageListener();
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={localStyles.welcome}>
            Wallet
          </Text>
          <Text>FCMToken: </Text>
          <TextInput style={localStyles.instructions}>
            {`${this.state.fcmToken}`}
          </TextInput>
          <Link
            to='/keystore'
            component={TouchableOpacity}
            activeOpacity={0.8}
            replace={false}
          >
            <Text style={styles.routerButton}>Keystore</Text>
          </Link>
        </View>
        <View style={{ backgroundColor: '#DEF' }}>
          <Text style={localStyles.welcome}>Notifications</Text>
          <FlatList
            data={this.state.notifications}
            extraData={this.state}
            renderItem={({ item: n }) => {
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
        </View>
        <View style={{ backgroundColor: '#FED' }}>
          <Text style={localStyles.welcome}>Messages</Text>
          <FlatList
            data={this.state.messages}
            extraData={this.state}
            renderItem={({ item: m }) => {
              const data = m.data;
              const id = m.id;
              return (
                <View style={{
                  padding: 10,
                }}>
                  <Text>{`Data: ${JSON.stringify(data)}`}</Text>
                  <Text>{`ID: ${id}`}</Text>
                </View>
              );
            }}
            keyExtractor={n => n.id}
          />
        </View>
      </ScrollView>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5ECFF',
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
  }
});

const mapStateToProps = state => ({
  email: state.email,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status)
