import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Text from '../components/text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from './theme';

const ChatHeaderBackButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.buttonBack} onPress={onPress}>
      <AntDesign name="left" size={25} color={theme.colors.primary} />
    </TouchableOpacity>
  );
};

const ChatHeader = ({navigation, route}) => {
  const {name, photoURL} = route.params.userChats;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ChatHeaderBackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.userDetails}>
        <Image source={{uri: photoURL}} style={styles.userImage} />
        <Text style={styles.userName}>{name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  buttonBack: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ChatHeader;
