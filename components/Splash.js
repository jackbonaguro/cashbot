import React from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { Link, Switch, Redirect } from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';
import { RegularIcons } from 'react-native-fontawesome';

import {
  fetchUser
} from '../actions';
import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import { default as ButtonInput } from './ButtonInput';
import { default as Button } from './Button';
import styles, { palette } from '../styles';
import Api from '../controllers/api';
import Storage from "../controllers/storage";

class Splash extends React.Component {
  async componentDidMount() {
    let db = await Storage.initializeStorage();
    this.props.dispatch(fetchUser());
  }

  render() {
    if (this.props.user && this.props.user.id) {
      //Found user, go to home screen
      console.log(this.props.user);
      return (
        <Redirect exact from="/" to="/createwallet" />
      );
    }
    else if (this.props.user) {
      //Found no user, sign them up
      console.log('No user');
      return (
        <Redirect exact from="/" to="/createaccount" />
      );
    }
    return (
      <View style={[styles.appContainer, {
        alignItems: 'center',
        justifyContent: 'center'
      }]}>
        <Text style={styles.title}>
          CashBot
        </Text>
      </View>
    );
  }
}

const mapStateToProps = ({ userReducer, messageReducer }) => {
  return {
    user: userReducer.user,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Splash)
