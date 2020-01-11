import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  Clipboard
} from 'react-native';
import { Link } from 'react-router-native';
import { connect } from 'react-redux';
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";
import { generateSecureRandom } from 'react-native-securerandom';
import Mnemonic, { bitcore } from 'bitcore-mnemonic';
import AsyncStorage from '@react-native-community/async-storage';
import QRCode from "react-native-qrcode-svg";
import { SolidIcons } from "react-native-fontawesome/FontAwesomeIcons";

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
import Storage from '../controllers/storage';
import KeyDerivation from '../controllers/keyderivation';
import TabBar from "./TabBar";
import { default as ButtonInput } from './ButtonInput';

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
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <View>
            <View>
              <Text style={styles.title}>Wallet</Text>
              <ButtonInput style={{...styles.instructions, maxWidth: 100+'%'}}
                           value={this.props.seed ? this.props.seed.toString() : '---'}
                           icon={SolidIcons.eye}
                           iconPress={() => {}}
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
              <Button title={'RELOAD'} onPress={() => {
                this.props.dispatch(fetchSeed());
              }}></Button>
              <Button title={'DELETE'} onPress={() => {
                this.props.dispatch(deleteSeed());
              }}></Button>
            </View>
            <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.instructions}>{`Current Index: ${(typeof this.props.receiveIndex !== 'undefined') ?
                  this.props.receiveIndex :
                  '---'}`}</Text>
                <Text style={styles.instructions}>Current Address:</Text>
                <ButtonInput style={styles.instructions}
                             value={(this.props.seed && (typeof this.props.receiveIndex !== 'undefined')) ?
                    KeyDerivation.deriveReceiveAddress(this.props.seed, this.props.receiveIndex) :
                    '---'}
                             icon={SolidIcons.copy}
                             iconPress={(value) => {
                               Clipboard.setString(value);
                             }}
                ></ButtonInput>
              </View>
            </View>
            <View style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <View style={{padding: 15, backgroundColor: pallette.white}}>
                <QRCode
                  value={
                    (this.props.seed && (typeof this.props.receiveIndex !== 'undefined')) ?
                      KeyDerivation.deriveReceiveAddress(this.props.seed, this.props.receiveIndex) :
                      '---'}
                  color={pallette.black}
                  size={150}
                  ecl={'H'}
                  backgroundColor={pallette.white}
                ></QRCode>
              </View>
            </View>
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
            <View>
              <Text style={styles.instructions}>Signed Message</Text>
              <View style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
              }}>
                <View style={{padding: 15, backgroundColor: pallette.white}}>
                  <QRCode
                    value={'Hello, World!!'}
                    color={pallette.black}
                    size={150}
                    ecl={'H'}
                    backgroundColor={pallette.white}
                  ></QRCode>
                </View>
                <View style={{padding: 15, backgroundColor: pallette.white}}>
                  <QRCode
                    value={
                      (this.props.seed && (typeof this.props.receiveIndex !== 'undefined')) ?
                        KeyDerivation.signMessage(this.props.seed, this.props.receiveIndex, 'Hello, World!!') :
                        '---'}
                    color={pallette.black}
                    size={150}
                    ecl={'H'}
                    backgroundColor={pallette.white}
                  ></QRCode>
                </View>
              </View>
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
  seed: userReducer.seed,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Keystore);
