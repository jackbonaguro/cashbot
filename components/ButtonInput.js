import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles, { palette } from "../styles";
import FontAwesome, { RegularIcons, SolidIcons, BrandIcons } from 'react-native-fontawesome'

import { default as TextInput } from './TextInput';

class ButtonInput extends React.Component {
  render() {
    return (
      <View
        style={[{
          ...this.props.style
        }, {
          backgroundColor: palette.inputBackground,
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
                       color={palette.white}
                       style={[{fontSize: 20, paddingLeft: 15},
                         styles.instructions]}
          ></FontAwesome>
        </TouchableOpacity>
      </View>
    )
  }
}

export default ButtonInput;
