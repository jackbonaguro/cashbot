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
    return (
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <View>
            <View>
              <Text style={styles.title}>Wallet</Text>
              { this.props.seed ? (
                <ButtonInput style={{...styles.instructions, maxWidth: 100+'%'}}
                             value={this.props.seed.toString()}
                             icon={RegularIcons.copy}
                             iconPress={(value) => {
                               Clipboard.setString(value);
                               Toast.show('Copied Mnemonic');
                             }}
                >
                </ButtonInput>
              ) : (<ActivityIndicator size="small" color={palette.purple} />)}
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
                <Text style={styles.instructions}>Current Index:</Text>
                { (typeof this.props.receiveIndex !== 'undefined') ? (
                  <Text style={styles.instructions}>{this.props.receiveIndex}</Text>
                ) : (<ActivityIndicator size="small" color={palette.purple} />)}
                <Text style={styles.instructions}>Current Address:</Text>
                { this.props.receiveAddress ? (
                  <ButtonInput style={styles.instructions}
                               value={this.props.receiveAddress}
                               icon={RegularIcons.copy}
                               iconPress={(value) => {
                                 Clipboard.setString(value);
                                 Toast.show('Copied Address');
                               }}
                  ></ButtonInput>
                ) : (<ActivityIndicator size="small" color={palette.purple} />)}
              </View>
            </View>
            <View style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              { this.props.receiveAddress ? (
                <QRCode
                  value={this.props.receiveAddress}
                  size={100}
                  ecl={'M'}
                ></QRCode>
              ) : (<ActivityIndicator size="large" color={palette.purple} />)}
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
            <View>
              <Text style={styles.instructions}>Signed Message: "Hello, World!!"</Text>
              { this.props.testSig ? (
                <View style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}>
                  <QRCode
                    value={'Hello, World!!'}
                    size={150}
                    ecl={'M'}
                    style={{
                      borderBottomRightRadius: 0,
                      borderTopRightRadius: 0,
                    }}
                  ></QRCode>
                  <QRCode
                  value={this.props.testSig}
                  size={150}
                  style={{
                    borderBottomLeftRadius: 0,
                    borderTopLeftRadius: 0,
                  }}
                  ecl={'M'}
                  ></QRCode>
                </View>
              ) : (<ActivityIndicator size="large" color={palette.purple} />)}
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
