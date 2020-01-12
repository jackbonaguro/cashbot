import React from 'react';
import {
  View,
  ScrollView,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { RegularIcons } from 'react-native-fontawesome';

import {
  setEmail
} from '../actions';
import { default as Text } from './Text';
import { default as TextInput } from './TextInput';
import { default as ButtonInput } from './ButtonInput';
import styles, { pallette } from '../styles';
import TabBar from "./TabBar";

class Account2 extends React.Component {
  componentDidMount() {
    //this.props.dispatch(fetchSigningIndex());
    //this.props.dispatch(deriveAndSetSigningXPriv(this.props.seed));
  }

  render() {
    let num = 1;
    if (this.props.match.url === '/account2') {
      num = 2;
    }
    return (
      <View style={styles.appContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Account{`${num}`}
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
)(Account2)
