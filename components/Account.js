import React from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { Link } from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';
import { RegularIcons } from 'react-native-fontawesome';

import {
  fetchSigningIndex,
  setEmail,
  setSigningIndex,
  setSigningXPriv,
  deriveAndSetSigningXPriv,
} from '../actions';
import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import { default as ButtonInput } from './ButtonInput';
import styles, { pallette } from '../styles';
import TabBar from "./TabBar";
import KeyDerivation from "../controllers/keyderivation";
import Api from '../controllers/api';

class Account extends React.Component {
  render() {
    return (
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Account
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
                    // Thunk call to /register api
                    try {
                      Api.register({
                        signingXPriv: this.props.signingXPriv,
                        email: this.props.email,
                        fcmToken: this.props.fcmToken
                      }, (err, apiResponse) => {
                        if (err) {
                          //console.warn(err);
                        }
                        // Register worked, make a note
                      });
                    } catch (err) {
                      //console.error(err);
                    }
                  }}
          >
          </Button>
        </ScrollView>
        <TabBar match={this.props.match}/>
      </View>
    );
  }
}

const mapStateToProps = ({ userReducer, messageReducer }) => ({
  email: userReducer.email,
  receiveIndex: userReducer.receiveIndex,
  signingIndex: userReducer.signingIndex,
  signingXPriv: userReducer.signingXPriv,
  seed: userReducer.seed,
  fcmToken: messageReducer.fcmToken
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account)
