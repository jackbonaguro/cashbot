import React from 'react';
import { View } from 'react-native';
import {palette} from "../styles";
import QRCode from "react-native-qrcode-svg";

let CustomText = (props) => {
  return (
    <View style={{
      padding: 15,
      backgroundColor: palette.white,
      borderRadius: 10,
      ...props.style
    }}>
      <QRCode
        value={props.value}
        color={palette.appBackground}
        size={props.size}
        ecl={props.ecl}
        backgroundColor={palette.white}
      ></QRCode>
    </View>
  )
};

export default CustomText;
