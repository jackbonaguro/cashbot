import React from 'react';
import { Text } from 'react-native';

let CustomText = (props) => {
  return (
    <Text
      {...props}
      style={[{
        ...props.style
      },{
        fontFamily: 'Iosevka'
      }]}
    >
      {props.children}
    </Text>
  )
};

export default CustomText;
