import React from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { Link } from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';

import { setEmail } from '../actions';

import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import styles, { pallette } from '../styles';
import TabBar from "./TabBar";

class Account extends React.Component {
  constructor() {
    super();
    this.state = {
      fcmToken: '',
      notifications: [],
      messages: [],
    };
  }

  render() {
    return (
      <View style={styles.appContainer}>
        <ScrollView contentContainerStyle={styles.container}
                    style={{
                      width: 100+'%',
                    }}
        >
          <Text style={styles.title}>
            Account
          </Text>
        </ScrollView>
        <TabBar match={this.props.match}/>
      </View>
    );
  }
}

const mapStateToProps = ({ userReducer }) => ({
  email: userReducer.email,
  address: userReducer.address,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account)
