import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles, { pallette } from "../styles";
import FontAwesome, { RegularIcons, SolidIcons, BrandIcons } from 'react-native-fontawesome'

import { default as TextInput } from './TextInput';

class ButtonInput extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
    // if (props) {
    //   this.state.value = this.props.value;
    // }
  }

  render() {
    return (
      <View
        style={[{
          ...this.props.style
        }, {
          backgroundColor: pallette.inputBackground,
          borderRadius: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
        }]}
      >
        <TextInput style={styles.instructions}
                   {...this.props}
        ></TextInput>
        <TouchableOpacity onPress={() => {
          this.props.iconPress(this.props.value);
        }}>
          <FontAwesome icon={this.props.icon}
                       color={pallette.white}
                       style={[{fontSize: 20, paddingLeft: 15},
                         styles.instructions]}
          ></FontAwesome>
        </TouchableOpacity>
      </View>
    )
  }
}

export default ButtonInput;
