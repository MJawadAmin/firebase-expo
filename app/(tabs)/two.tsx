import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Login from '../index';

export default function TabTwoScreen() {
  return (
    <View >
      <Text>Login</Text>
      <Login/>
    </View>
  );
}