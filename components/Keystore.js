import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Button,
} from 'react-native';
import { Link } from 'react-router-native';
import { connect } from 'react-redux';
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";
import { generateSecureRandom } from 'react-native-securerandom';
import Mnemonic, { bitcore } from 'bitcore-mnemonic';
import AsyncStorage from '@react-native-community/async-storage';

import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import styles, { pallette } from '../styles';

import {
  fetchReceiveIndex,
  incrementReceiveIndex,
  resetReceiveIndex,
  fetchSeed,
  setSeed,
  setReceiveIndex,
  generateSeed,
  deleteSeed
} from '../actions';
import Storage from '../storage';
import KeyDerivation from '../keyderivation';
import TabBar from "./TabBar";

class Keystore extends React.Component {
  constructor() {
    super();
  }

  async componentDidMount() {
    this.props.dispatch(fetchSeed());
    this.props.dispatch(fetchReceiveIndex());
  }

  deriveAddress(mnemonic, index) {
    // Will return address string
    var xpriv = mnemonic.toHDPrivateKey();

    const derivationPath = `m/44'/1'/0'/0/${index}`;
    const derivedXPriv = xpriv.derive(derivationPath);
    const pubKey = derivedXPriv.publicKey;
    const address = pubKey.toAddress();
    return `${address}`;
  }

  render() {
    return (
      <View style={styles.appContainer}>
        <ScrollView>
          <View style={styles.container}
          >
            <View>
              <Text style={styles.title}>Keystore</Text>
              <TextInput style={styles.instructions}>
                {this.props.seed ? this.props.seed.toString() : '---'}
              </TextInput>
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
              <Button title={'RELOAD'} onPress={() => {
                this.props.dispatch(fetchSeed());
              }}></Button>
              <Button title={'DELETE'} onPress={() => {
                this.props.dispatch(deleteSeed());
              }}></Button>
            </View>
            <View style={{ paddingVertical: 10 }}>
              <Text style={styles.instructions}>{`Current Index: ${(typeof this.props.receiveIndex !== 'undefined') ?
                this.props.receiveIndex :
                '---'}`}</Text>
              <Text style={styles.instructions}>Current Address:</Text>
              <TextInput style={styles.instructions}>
                {(this.props.seed && (typeof this.props.receiveIndex !== 'undefined')) ?
                  KeyDerivation.deriveAddress(this.props.seed, this.props.receiveIndex) :
                  '---'}
              </TextInput>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Button title={'INCREMENT'} onPress={() => {
                  this.props.dispatch(incrementReceiveIndex(this.props.receiveIndex));
                }}></Button>
                <Button title={'RESET'} onPress={() => {
                  Storage.saveReceiveIndex(0).then(() => {
                    this.props.dispatch(resetReceiveIndex());
                  }).catch(console.error);
                }}></Button>
              </View>
            </View>
            <Link
              to='/status'
              component={TouchableOpacity}
              activeOpacity={0.8}
              replace={false}
            >
              <Text style={styles.routerButton}>Status</Text>
            </Link>
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
  seed: userReducer.seed,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Keystore);
