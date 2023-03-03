import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Text from '../components/text';

const ChatHeader = ({navigation, route}) => {
  const {name, photoURL} = route.params.userChats;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Back</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={{uri: photoURL}}
          style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}}
        />
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
          {name}
        </Text>
      </View>
      <View style={{width: 40}} />
    </View>
  );
};

export default ChatHeader;
