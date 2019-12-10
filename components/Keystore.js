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
      key: null
    };
  }

  new() {
    generateSecureRandom(24).then(randomBytes => {
      this.setState({
        key: new Buffer(randomBytes),
      });
    });
  }

  save(key) {
    const keyIndex = 0;
    RNSecureKeyStore.set(`KEY-${keyIndex}`, JSON.stringify(key), { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY })
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
          key: new Buffer(JSON.parse(res))
        });
      }, (err) => {
        console.warn(err);
      });
  }

  delete() {
    RNSecureKeyStore.remove("key1")
      .then((res) => {
        /* this.setState({
          key: null
        }); */
      }, (err) => {
        console.warn(err);
      });
  }

  render() {
    return (
      <View>
        <View>
          <TextInput>
            {this.state.key ? /* JSON.stringify(this.state.key) */ Mnemonic.fromSeed(this.state.key, Mnemonic.Words.ENGLISH).toString() : 'No Key'}
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
            this.save(this.state.key);
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
