import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
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
import styles, { pallette } from '../styles';

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

class Keystore extends React.Component {
  constructor() {
    super();
  }

  async componentDidMount() {
    this.props.dispatch(fetchSeed());
    this.props.dispatch(fetchReceiveIndex());
  }

  render() {
    const address = (this.props.seed && (typeof this.props.receiveIndex !== 'undefined')) ?
      KeyDerivation.deriveReceiveAddress(this.props.seed, this.props.receiveIndex) :
      null;
    return (
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <View>
            <View>
              <Text style={styles.title}>Wallet</Text>
              <ButtonInput style={{...styles.instructions, maxWidth: 100+'%'}}
                           value={this.props.seed ? this.props.seed.toString() : '---'}
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
                ) : (<ActivityIndicator size="small" color="#880088" />)}
                <Text style={styles.instructions}>Current Address:</Text>
                { address ? (
                  <ButtonInput style={styles.instructions}
                               value={address}
                               icon={RegularIcons.copy}
                               iconPress={(value) => {
                                 Clipboard.setString(value);
                                 Toast.show('Copied Address');
                               }}
                  ></ButtonInput>
                ) : (<ActivityIndicator size="small" color="#880088" />)}
              </View>
            </View>
            <View style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              { address ? (
                <QRCode
                  value={address}
                  size={100}
                  ecl={'M'}
                ></QRCode>
              ) : (<ActivityIndicator size="large" color="#880088" />)}
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
              <Text style={styles.instructions}>Signed Message: "Hello, World!!"</Text>
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
                  value={
                    (this.props.seed && (typeof this.props.receiveIndex !== 'undefined')) ?
                      KeyDerivation.signReceiveMessage(this.props.seed, this.props.receiveIndex, 'Hello, World!!') :
                      '---'}
                  size={150}
                  style={{
                    borderBottomLeftRadius: 0,
                    borderTopLeftRadius: 0,
                  }}
                  ecl={'M'}
                ></QRCode>
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
