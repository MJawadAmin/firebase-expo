import React from 'react';
import { View, StyleSheet } from 'react-native';
import Login from './index'; // Ensure the path is correct

const Home = () => {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1, // makes sure the view takes up the whole screen
  },
});
