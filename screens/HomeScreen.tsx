import React, {useContext, useEffect, useState, memo, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ChatList from '../components/chatList';

import theme from '../components/theme';
import UserSearch from './UserSearch';

const HomeScreen = memo(() => {
  return (
    <View style={{flex: 1, backgroundColor: '#1b1b1b'}}>
      <UserSearch />
      <ChatList />
    </View>
  );
});

export default HomeScreen;
