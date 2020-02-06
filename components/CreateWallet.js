import React from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator
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
  generateSeed
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
              this.props.dispatch(registerWallet(this.props.seed));
            }}></Button>
        </ScrollView>
        {/*<TabBar match={this.props.match}/>*/}
      </View>
    );
  }
}

const mapStateToProps = ({ userReducer, messageReducer }) => {
  console.log(userReducer);
  return {
    seed: userReducer.seed,
  }
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWallet)
