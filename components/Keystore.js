import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Clipboard,
  ActivityIndicator
} from 'react-native';
import { Link } from 'react-router-native';
import { connect } from 'react-redux';
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";
import { generateSecureRandom } from 'react-native-securerandom';
import Mnemonic, { bitcore } from 'bitcore-mnemonic';
import AsyncStorage from '@react-native-community/async-storage';
import { SolidIcons, RegularIcons } from "react-native-fontawesome/FontAwesomeIcons";
import Toast from 'react-native-simple-toast';

import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import { default as QRCode } from './QRCode';
import styles, { palette } from '../styles';

import {
  fetchReceiveIndex,
  fetchSigningIndex,
  incrementReceiveIndex,
  resetReceiveIndex,
  fetchSeed,
  setSeed,
  setReceiveIndex,
  generateSeed,
  deleteSeed
} from '../actions';
import Storage from '../controllers/storage';
import KeyDerivation from '../controllers/keyderivation';
import TabBar from "./TabBar";
import { default as ButtonInput } from './ButtonInput';
import { default as Button } from './Button';

class Keystore extends React.Component {
  render() {
    //console.log('Rendering keystore');
    return (
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <View>
            <View>
              <Text style={styles.title}>Wallet</Text>
            </View>
            <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.instructions}>Current Index:</Text>
                { (typeof this.props.receiveIndex !== 'undefined') ? (
                  <Text style={styles.instructions}>{this.props.receiveIndex}</Text>
                ) : (<ActivityIndicator size="small" color={palette.purple} />)}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Button title={'INCREMENT'} onPress={() => {
                this.props.dispatch(incrementReceiveIndex(this.props.seed, this.props.receiveIndex));
              }}></Button>
              <Button title={'RESET'} onPress={() => {
                this.props.dispatch(resetReceiveIndex(this.props.seed));
              }}></Button>
            </View>
          </View>
        </ScrollView>
        <TabBar match={this.props.match}/>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
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

const mapStateToProps = ({ userReducer }) => ({
  email: userReducer.email,
  receiveIndex: userReducer.receiveIndex,
  receiveAddress: userReducer.receiveAddress,
  seed: userReducer.seed,
  testSig: userReducer.testSig,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Keystore);
