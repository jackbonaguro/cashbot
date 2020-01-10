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
import { setAddress } from '../actions';
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";
import { generateSecureRandom } from 'react-native-securerandom';
import Mnemonic, { bitcore } from 'bitcore-mnemonic';
import AsyncStorage from '@react-native-community/async-storage';

import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import styles, { pallette } from '../styles';

class Keystore extends React.Component {
  constructor() {
    super();
    this.state = {
      mnemonic: null,
      index: null,
      address: null,
    };
  }

  async componentDidMount() {
    this.load();
    this.loadIndex();
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

  new() {
    // 16 bytes = 128 bits, yielding a 12-word mnemonic (compatible with most wallets)
    // https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
    generateSecureRandom(16).then(randomBytes => {
      // Successfully generates new BIP39 Mnemonic from native secure RNG
      let mnemonic = Mnemonic.fromSeed(new Buffer(randomBytes), Mnemonic.Words.ENGLISH);
      console.log(mnemonic);
      this.setState({
        mnemonic,
      });
    });
  }

  save(mnemonic) {
    const keyIndex = 0;
    RNSecureKeyStore.set(`KEY-${keyIndex}`, mnemonic.toString(), { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY })
      .then((res) => {
        console.log(res);
      }, (err) => {
        console.warn(err);
      });
  }

  load() {
    const keyIndex = 0;
    RNSecureKeyStore.get(`KEY-${keyIndex}`)
      .then((res) => {
        this.setState({
          mnemonic: new Mnemonic(res, Mnemonic.Words.ENGLISH),
        });
      }, (err) => {
        if (err && err.code && err.code === '404') {
          // 404 comes from filesystem server, means no file exists at this path.
          // For now we just set mnemonic back to null.
          this.setState({
            mnemonic: null,
          });
        } else {
          console.warn(err);
        }
      });
  }

  delete() {
    const keyIndex = 0;
    RNSecureKeyStore.remove(`KEY-${keyIndex}`)
      .then((res) => {
        console.log(res)
      }, (err) => {
        console.warn(err);
      });
  }

  async saveIndex(index) {
    const keyIndex = 0;
    try {
      await AsyncStorage.setItem(`KEY-${keyIndex}/INDEX`, `${index}`);
    } catch (e) {
      console.error(e);
    }
  }

  async loadIndex() {
    const keyIndex = 0;
    this.props.dispatch(setAddress('...'));
    try {
      const value = await AsyncStorage.getItem(`KEY-${keyIndex}/INDEX`)
      let index;
      if (value !== null) {
        // value previously stored
        index = parseInt(value);
      } else {
        index = 0;
      }
      const address = this.deriveAddress(this.state.mnemonic, index);
      this.props.dispatch(setAddress(address));
      this.setState({
        index,
        //address,
      })
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}
        >
          <View>
            <Text style={styles.title}>Keystore</Text>
            <TextInput style={styles.instructions}>
              {this.state.mnemonic ? this.state.mnemonic.toString() : 'No Key'}
            </TextInput>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button title={'NEW'} onPress={() => {
              this.new();
            }}></Button>
            <Button title={'SAVE'} onPress={() => {
              this.save(this.state.mnemonic);
            }}></Button>
            <Button title={'LOAD'} onPress={() => {
              this.load();
            }}></Button>
            <Button title={'DELETE'} onPress={() => {
              this.delete();
            }}></Button>
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Text style={styles.instructions}>{`Current Index: ${this.state.index}`}</Text>
            <Text style={styles.instructions}>Current Address:</Text>
            <TextInput style={styles.instructions}>
              {this.props.address}
            </TextInput>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Button title={'INCREMENT'} onPress={async () => {
                this.saveIndex(this.state.index + 1).then(() => {
                  this.loadIndex();
                }).catch(console.error);
              }}></Button>
              <Button title={'RESET'} onPress={async () => {
                this.saveIndex(0).then(() => {
                  this.loadIndex();
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
  address: userReducer.address,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Keystore);
