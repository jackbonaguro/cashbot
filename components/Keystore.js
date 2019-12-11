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
import Mnemonic from 'bitcore-mnemonic';
import AsyncStorage from '@react-native-community/async-storage';

export default class Keystore extends React.Component {
  constructor() {
    super();
    this.state = {
      mnemonic: null,
      index: null,
    };
  }

  async componentDidMount() {
    this.load();
    const index = await this.loadIndex();
    if (index === null) {
      this.saveIndex(0);
      this.setState({
        index: 0,
      });
    }
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
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if (value !== null) {
        // value previously stored
        this.setState({
          index: parseInt(value),
        });
        return parseInt(value);
      } else {
        this.setState({
          index: null,
        });
        return null;
      }
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
        <View>
          <Text>{`Current Index: ${this.state.index}`}</Text>
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