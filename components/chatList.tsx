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
import theme from './theme';

const ChatList = React.memo(() => {
  const {user} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);
  const currentUser = useMemo(() => user._user, [user._user]);
  const [chats, setChats] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('usersChat')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
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
    [dispatch, navigation],
  );
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 2) {
      return date.toLocaleDateString();
    } else if (days === 2) {
      return 'Yesterday';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (hours >= 1) {
      const hours12 = hours % 12 || 12;
      const ampm = hours < 12 ? 'AM' : 'PM';
      return `${hours12}:${date.getMinutes()} ${ampm}`;
    } else {
      return `${minutes} minutes ago`;
    }
  };

  const renderItem = ({item}) => {
    const {userChats, lastMessage, date} = item[1];
    const {name, photoURL} = userChats;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(userChats)}
        style={styles.itemContainer}>
        <View style={styles.itemImage}>
          <Image
            style={{
              resizeMode: 'contain',
              width: 38,
              height: 38,
              borderRadius: 50,
            }}
            source={{uri: photoURL}}
          />
        </View>

        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.timestamp}>{formatDate(date?.toDate())}:</Text>
            <Text numberOfLines={1} style={styles.itemLastMessage}>
              {lastMessage?.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data, index) => ({
    length: 90,
    offset: 90 * index,
    index,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chats</Text>
      <FlatList
        data={Object.entries(chats)?.sort((a, b) => a[1].date - b[1].date)}
        keyExtractor={item => item[0] + item[1].userChats.uid}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
      />
    </View>
  );
});

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 50,
    backgroundColor: theme.colors.gray,
    padding: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'white',
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  itemName: {
    color: 'white',
    fontSize: 18,
  },
  itemLastMessage: {
    color: 'white',
    opacity: 0.5,
  },
  timestamp: {
    color: theme.colors.primary,
    fontSize: 11,
    marginRight: 3,
  },
});
