import React from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import {Link, Redirect} from 'react-router-native';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';
import { RegularIcons } from 'react-native-fontawesome';

import {
  fetchSigningIndex,
  setSigningIndex,
  setSigningXPriv,
  deriveAndSetSigningXPriv,
  generateSeed,
  registerWallet,
} from '../actions';
import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import { default as ButtonInput } from './ButtonInput';
import { default as Button } from './Button';
import styles, { palette } from '../styles';
import TabBar from "./TabBar";
import KeyDerivation from "../controllers/keyderivation";
import Api from '../controllers/api';

class CreateWallet extends React.Component {
  render() {
    if (this.props.user && this.props.user.masterKey) {
      //Found user with wallet, go to home screen
      console.log(this.props.user);
      return (
        <Redirect exact from="/" to="/wallet" />
      );
    }
    return (
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Create Wallet
          </Text>
          <View>
              <Text style={styles.title}>Wallet</Text>
              <ButtonInput style={{...styles.instructions, maxWidth: 100+'%'}}
                           defaultValue={this.props.seed || ''}
                           icon={RegularIcons.copy}
                           iconPress={(value) => {
                             Clipboard.setString(value);
                             Toast.show('Copied Mnemonic');
                           }}
              >
              </ButtonInput>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Button title={'NEW'} onPress={() => {
                this.props.dispatch(generateSeed());
              }}></Button>
            </View>
            <Button title={'CREATE WALLET'} onPress={() => {
              if (this.props.user && this.props.user.email) {
                this.props.dispatch(registerWallet(this.props.seed, this.props.user.email));
              }
            }}></Button>
        </ScrollView>
        {/*<TabBar match={this.props.match}/>*/}
      </View>
    );
  }
}

const mapStateToProps = ({ userReducer, messageReducer }) => {
  return {
    seed: userReducer.seed,
    user: userReducer.user,
  }
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWallet)
