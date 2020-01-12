import React from 'react';
import {
  View,
  ScrollView,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { RegularIcons } from 'react-native-fontawesome';

import {
  fetchReceiveIndex,
  fetchSeed,
  setEmail
} from '../actions';
import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import { default as ButtonInput } from './ButtonInput';
import styles, { pallette } from '../styles';
import TabBar from "./TabBar";
import KeyDerivation from "../controllers/keyderivation";
import Mnemonic from "bitcore-mnemonic";

class Account extends React.Component {
  constructor() {
    super();
    this.state = {
      mnemonic: new Mnemonic('absorb notice behind exhibit industry wool nominee eyebrow into phone sight nut'),
    };
  }
  render() {
    const address = KeyDerivation.deriveReceiveAddress(this.state.mnemonic, 1);
    return (
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Account1
          </Text>
          <Text style={styles.instructions}>Email: </Text>
          <ButtonInput
            onSubmitEditing={({nativeEvent})=> {
              this.props.dispatch(setEmail(nativeEvent.text));
            }}
            defaultValue={this.props.email || ''}
            icon={RegularIcons.timesCircle}
            iconPress={() => {
              this.props.dispatch(setEmail());
            }}
          ></ButtonInput>
          <Button title={'REGISTER'}
                  onPress={() => {
                    KeyDerivation.deriveReceiveAddress(this.state.mnemonic, 1);
                  }}
          >
          </Button>
        </ScrollView>
        <TabBar match={this.props.match}/>
      </View>
    );
  }
}

const mapStateToProps = ({ userReducer, messageReducer }) => ({
  email: userReducer.email
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account)
