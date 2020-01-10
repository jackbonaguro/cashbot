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

import { default as Text } from './Text';
import styles, { pallette } from '../styles';

const TabBar = (props) => {
  return (
    <View style={styles.tabBar}>
      <Link style={styles.tabBarLink}
        to='/status'
        component={TouchableOpacity}
        activeOpacity={0.8}
        replace={false}
      >
        <Text style={styles.tabBarButton}>Status</Text>
      </Link>
      <Link style={[
        styles.tabBarLink,
        {
          backgroundColor: '#F0FFF0',
        }
      ]}
        to='/keystore'
        component={TouchableOpacity}
        activeOpacity={0.8}
        replace={false}
      >
        <Text style={styles.tabBarButton}>Keystore</Text>
      </Link>
      <Link style={styles.tabBarLink}
        to='/account'
        component={TouchableOpacity}
        activeOpacity={0.8}
        replace={false}
      >
        <Text style={styles.tabBarButton}>Account</Text>
      </Link>
    </View>
  );
};

export default TabBar;
