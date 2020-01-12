import React from 'react';
import { View } from 'react-native';
import {pallette} from "../styles";
import QRCode from "react-native-qrcode-svg";

let CustomText = (props) => {
  return (
    <View style={{
      padding: 15,
      backgroundColor: pallette.white,
      borderRadius: 10,
      ...props.style
    }}>
      <QRCode
        value={props.value}
        color={pallette.appBackground}
        size={props.size}
        ecl={props.ecl}
        backgroundColor={pallette.white}
      ></QRCode>
    </View>
  )
};

export default CustomText;
