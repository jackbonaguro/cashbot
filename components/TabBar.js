import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Button,
} from 'react-native';
import { Link } from 'react-router-native';
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";
import { generateSecureRandom } from 'react-native-securerandom';
import Mnemonic, { bitcore } from 'bitcore-mnemonic';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';

import { default as Text } from './Text';
import styles, { pallette } from '../styles';

const TabBar = (props) => {
  let getStyle = (path) => {
    console.log(props.match);
    if (props.match.url === path) {
      return styles.tabBarButtonActive;
    } else {
      return styles.tabBarButton;
    }
  };

  return (
    <View style={styles.tabBar}>
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Link style={styles.tabBarLink}
              to='/status'
              component={TouchableOpacity}
              activeOpacity={0.8}
              replace={false}
        >
          <FontAwesome icon={RegularIcons.bell} color={'#FFF'} style={getStyle('/status')}/>
        </Link>
        <Link style={styles.tabBarLink}
              to='/keystore'
              component={TouchableOpacity}
              activeOpacity={0.8}
              replace={false}
        >
          <FontAwesome icon={SolidIcons.wallet} color={'#FFF'} style={getStyle('/keystore')}/>
        </Link>
        <Link style={styles.tabBarLink}
              to='/account'
              component={TouchableOpacity}
              activeOpacity={0.8}
              replace={false}
        >
          <FontAwesome icon={RegularIcons.user} color={'#FFF'} style={getStyle('/account')}/>
        </Link>
      </View>
    </View>
  );
};

export default TabBar;
