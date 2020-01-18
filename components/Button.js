import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles, { palette } from "../styles";
//import FontAwesome, { RegularIcons, SolidIcons, BrandIcons } from 'react-native-fontawesome'

import { default as Text } from './Text';

class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[{
          ...this.props.style
        }, {
          backgroundColor: palette.purple,
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 7,
        }]}
        onPress={this.props.onPress}
      >
        <Text style={{
          color: palette.white
        }}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }
}

export default Button;
