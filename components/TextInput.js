import React from 'react';
import { TextInput } from 'react-native';
import {pallette} from "../styles";

let CustomTextInput = (props) => {
  return (
    <TextInput
      {...props}
      style={[{
        ...props.style
      },{
        fontFamily: 'Iosevka'
      }]}
    >
      {props.children}
    </TextInput>
  )
};

export default CustomTextInput;
