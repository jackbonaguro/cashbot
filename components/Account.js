import React from 'react';
import {
  View,
  ScrollView,
  Button, ActivityIndicator
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
  componentDidMount() {
    this.props.dispatch(setEmail());
  }

  render() {
    //this.props.dispatch(setEmail());
    return (
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Account1
          </Text>
          <Text style={styles.instructions}>Email: </Text>
          { (typeof this.props.email !== 'undefined') ? (
            <Text style={styles.instructions}>{this.props.email}</Text>
          ) : (<ActivityIndicator size="small" color="#880088" />)}
          <Button title={'REGISTER'}
                  onPress={() => {
                    this.props.dispatch(setEmail());
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
