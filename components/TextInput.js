import React from 'react';
import { TextInput } from 'react-native';

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
