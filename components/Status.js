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

import { incrementReceiveIndex, addMessage, addNotification } from '../actions';

import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import styles, { pallette } from '../styles';
import TabBar from "./TabBar";

import KeyDerivation from "../controllers/keyderivation";
import Api from '../controllers/api';

class Status extends React.Component {
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
              {`${this.props.fcmToken}`}
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
              data={this.props.notifications}
              extraData={this.props}
              renderItem={({ item: n }) => {
                const title = n.title;
                const body = n.body;
                const id = n.id;
                return (
                  <View style={{
                    padding: 10,
                  }}>
                    <Text style={styles.instructions}>{`Name: ${title}`}</Text>
                    <Text style={styles.instructions}>{`Body: ${body}`}</Text>
                    <Text style={styles.instructions}>{`ID: ${id}`}</Text>
                  </View>
                );
              }}
              keyExtractor={n => n.id}
            />
          </View>
          <View style={{ backgroundColor: '#312' }}>
            <Text style={styles.title}>Messages</Text>
            <FlatList
              data={this.props.messages}
              extraData={this.props}
              renderItem={({ item: m }) => {
                const data = m.data;
                const id = m.id;
                return (
                  <View style={{
                    padding: 10,
                  }}>
                    <Text style={styles.instructions}>{`Data: ${JSON.stringify(data)}`}</Text>
                    <Text style={styles.instructions}>{`ID: ${id}`}</Text>
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

const mapStateToProps = ({ userReducer, messageReducer }) => ({
  email: userReducer.email,
  receiveIndex: userReducer.receiveIndex,
  seed: userReducer.seed,
  messages: messageReducer.messages,
  notifications: messageReducer.notifications,
  fcmToken: messageReducer.fcmToken,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status)
