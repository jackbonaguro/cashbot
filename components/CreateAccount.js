import React from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';
import { RegularIcons } from 'react-native-fontawesome';

import {
  setEmail,
  registerAccount,
} from '../actions';
import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import { default as ButtonInput } from './ButtonInput';
import { default as Button } from './Button';
import styles, { palette } from '../styles';
import TabBar from "./TabBar";
import KeyDerivation from "../controllers/keyderivation";
import Api from '../controllers/api';

class CreateAccount extends React.Component {
  render() {
    if (this.props.user && this.props.user.id) {
      //Found user, go to home screen
      return (
        <Redirect exact from="/" to="/createwallet" />
      );
    }
    return (
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Create Account
          </Text>
          <Text style={styles.instructions}>Email: </Text>
          <ButtonInput
            onSubmitEditing={({nativeEvent})=> {
              this.props.dispatch(setEmail(nativeEvent.text));
            }}
            defaultValue={this.props.email || ''}
            icon={RegularIcons.timesCircle}
            iconPress={() => {
              this.props.dispatch(setEmail());
            }}
          ></ButtonInput>
          <Button title={'REGISTER'}
                  onPress={() => {
                    this.props.dispatch(registerAccount(this.props.email));
                  }}
          ></Button>
        </ScrollView>
        {/*<TabBar match={this.props.match}/>*/}
      </View>
    );
  }
}

const mapStateToProps = ({ userReducer, messageReducer }) => ({
  email: userReducer.email,
  user: userReducer.user,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount)
