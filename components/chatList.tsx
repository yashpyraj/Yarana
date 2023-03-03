import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../App';
import Text from '../components/text';
import {ChatContext} from './userContext';
import {useNavigation} from '@react-navigation/native';

const ChatList = React.memo(() => {
  const {user} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);
  const currentUser = useMemo(() => user._user, [user._user]);
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    console.log(currentUser.uid);
    const unsubscribe = firestore()
      .collection('usersChat')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('ChatList: ', documentSnapshot.data());
          setChats(documentSnapshot.data());
        }
      });
    return unsubscribe;
  }, [currentUser.uid]);

  const handleSelect = useCallback(
    userChats => {
      dispatch({type: 'CHANGE_USER', payload: userChats});
      navigation.navigate('Chat', {userChats});
    },
    [navigation],
  );

  const renderItem = ({item}) => {
    const {userChats} = item[1];
    const {name, photoURL, lastMessage} = userChats;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(userChats)}
        style={styles.itemContainer}>
        <Image style={styles.itemImage} source={{uri: photoURL}} />
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{name}</Text>
          <Text style={styles.itemLastMessage}>{lastMessage?.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Text style={styles.text}>chatList</Text>
      <FlatList
        data={Object.entries(chats)}
        keyExtractor={item => item[0] + item[1].userChats.uid}
        renderItem={renderItem}
      />
    </View>
  );
});

export default ChatList;

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'white',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  itemName: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemLastMessage: {
    color: 'white',
  },
});
