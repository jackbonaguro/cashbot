import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Button,
} from 'react-native';
import { connect } from 'react-redux';
import {Link, Switch} from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';

import { setEmail } from '../actions';

import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import styles, { pallette } from '../styles';
import TabBar from "./TabBar";
import KeyDerivation from "../controllers/keyderivation";

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
        //console.log('FCM Token: ', fcmToken);
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
          //console.log('FCM messaging has permission:' + enabled)
        } else {
          try {
            await firebase.messaging().requestPermission();
            //console.log('FCM permission granted')
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
      //console.log(`FCMToken: ${fcmToken}`);
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
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={{}}>
          <View>
            <Text style={styles.title}>
              Wallet
            </Text>
            <Text style={styles.instructions}>FCMToken: </Text>
            <TextInput style={styles.instructions}>
              {`${this.state.fcmToken}`}
            </TextInput>
            <Text style={styles.instructions}>Current Address: </Text>
            <TextInput style={styles.instructions}>
              {(this.props.seed && (typeof this.props.receiveIndex !== 'undefined')) ?
                KeyDerivation.deriveReceiveAddress(this.props.seed, this.props.receiveIndex) :
                '---'}
            </TextInput>
          </View>
          <View style={{ backgroundColor: '#123' }}>
            <Text style={styles.title}>Notifications</Text>
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
          <View style={{ backgroundColor: '#312' }}>
            <Text style={styles.title}>Messages</Text>
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
        <TabBar match={this.props.match}/>
      </View>
    );
  }
}

const mapStateToProps = ({ userReducer }) => ({
  email: userReducer.email,
  receiveIndex: userReducer.receiveIndex,
  seed: userReducer.seed,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status)
