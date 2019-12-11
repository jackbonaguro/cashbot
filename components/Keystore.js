import React from 'react';
import {
  StyleSheet,
  Platform,
  TextInput,
  Text,
  View,
  ScrollView,
  FlatList,
  Button,
} from 'react-native';

import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";
import { generateSecureRandom } from 'react-native-securerandom';
import Mnemonic, { bitcore } from 'bitcore-mnemonic';
import AsyncStorage from '@react-native-community/async-storage';

export default class Keystore extends React.Component {
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
    await this.loadIndex();
  }

  deriveAddress(mnemonic, index) {
    // Will return address string
    var xpriv = mnemonic.toHDPrivateKey();

    const derivationPath = `m/44'/1'/0'/0/${index}`;
    const derivedXPriv = xpriv.derive(derivationPath);
    const pubKey = derivedXPriv.publicKey; //.toObject().publicKey;
    const address = pubKey.toAddress();
    console.log(`Address: ${address}`);
    return `${address}`;
    // const rootPrivKey = xpriv.derive(rootPath);
    // const rootPubKey = rootPrivKey.hdPublicKey;

    // const derivedXPriv = rootPrivKey.derive(ripplePath);
    // const derivedPubkey = derivedXPriv.hdPublicKey.toObject().publicKey;
    // const rippleAddress = rippleKeypairs.deriveAddress(derivedPubkey);

    // console.log(`Extended Root Private Key: ${rootPrivKey.toObject().xprivkey}`);
    // console.log(`Extended Root Public Key: ${rootPubKey.toObject().xpubkey}`);
    // console.log(`Root Private Key: ${rootPrivKey.toObject().privateKey}`);
    // console.log(`Root Public Key: ${rootPubKey.toObject().publicKey}`);

    //console.log(`Derived Private Key: ${derivedXPriv.toObject().privateKey}`);
    //console.log(`Ripple Address: ${rippleAddress}`);
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
      this.setState({
        index,
        address,
      })
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <View>
        <View>
          <Text style={styles.welcome}>Keystore</Text>
          <TextInput>
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
          <TextInput>
            {this.state.address}
          </TextInput>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button title={'INCREMENT'} onPress={async () => {
              await this.saveIndex(this.state.index + 1);
              await this.loadIndex();
            }}></Button>
            <Button title={'RESET'} onPress={async () => {
              await this.saveIndex(0);
              await this.loadIndex();
            }}></Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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