import React from 'react';
import { TextInput } from 'react-native';
import {palette} from "../styles";

let CustomTextInput = (props) => {
  return (
    <TextInput
      {...props}
      style={[{
        ...props.style
      },{
        fontFamily: 'Iosevka',
        flexShrink: 1
      }]}
    >
      {props.children}
    </TextInput>
  )
};

export default CustomTextInput;
