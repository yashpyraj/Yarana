import {
  FlatList,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import theme from '../components/theme';
import UserSearch from './UserSearch';
const HomeScreen = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#1b1b1b'}}>
      <UserSearch />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.dark,
    padding: 10,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: theme.colors.white,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    fontSize: 14,
    color: 'white',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});
