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

export default class Keystore extends React.Component {
  constructor() {
    super();
    this.state = {
      mnemonic: null
    };
  }

  new() {
    generateSecureRandom(24).then(randomBytes => {
      let mnemonic = Mnemonic.fromSeed(new Buffer(randomBytes), Mnemonic.Words.ENGLISH);
      console.log(mnemonic);
      this.setState({
        // Successfully generates new BIP39 Mnemonic from native secure RNG
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

  render() {
    return (
      <View>
        <View>
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
      </View>
    );
  }
}
