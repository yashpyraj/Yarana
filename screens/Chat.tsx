import {
  View,
  TextInput,
  Button,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState, useEffect, useMemo, useRef} from 'react';
import Text from '../components/text';
import ChatHeader from '../components/ChatHeader';
import {ChatContext} from '../components/userContext';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../App';
import {generateRandomId} from '../utits/id';
import theme from '../components/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface IMessage {
  id: string;
  senderId: string;
  photoURL: 'string';
  text: string;
  date: number;
}

const Chat = ({navigation, route}: {navigation: any; route: any}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState<string>('');
  const {data} = useContext(ChatContext);
  const {user} = useContext(AuthContext);
  const {width, height} = useWindowDimensions();
  const currentUser = useMemo(() => user._user, [user._user]);
  const flatListRef = useRef<FlatList<IMessage>>(null);

  useEffect(() => {
    // flatListRef.current?.scrollToEnd({animated: true});

    const unsubscribe = firestore()
      .collection('chats')
      .doc(data.chatId)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setMessages(documentSnapshot.data()?.messages ?? []);
        }
      });

    return unsubscribe;
  }, [data.chatId]);

  const handleSend = React.useCallback(() => {
    // Handle sending the message
    const trimmedMessage = text.trim();
    if (trimmedMessage === '') {
      return;
    }

    const newMessage: IMessage = {
      id: generateRandomId(),
      senderId: currentUser.uid,
      photoURL: currentUser.photoURL,
      text: trimmedMessage,
      date: Date.now(),
    };
    firestore()
      .collection('chats')
      .doc(data.chatId)
      .update({
        messages: firestore.FieldValue.arrayUnion(newMessage),
      })
      .then(() => {
        console.log('Message sent!');
      })
      .catch(error => {
        console.log('Error sending message: ', error);
      });

    Promise.all([
      firestore()
        .collection('usersChat')
        .doc(currentUser.uid)
        .update({
          [data.chatId + '.lastMessage']: {
            text: trimmedMessage,
          },
          [data.chatId + '.date']: firestore.FieldValue.serverTimestamp(),
        }),
      firestore()
        .collection('usersChat')
        .doc(data.user.uid)
        .update({
          [data.chatId + '.lastMessage']: {
            text: trimmedMessage,
          },
          [data.chatId + '.date']: firestore.FieldValue.serverTimestamp(),
        }),
    ])
      .then(() => {
        console.log('Users updated!');
      })
      .catch(error => {
        console.log('Error updating users: ', error);
      });

    // Reset the input field
    setText('');
  }, [text, data, currentUser.uid]);
  function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diff / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      if (diffMinutes < 60) {
        if (diffSeconds < 60) {
          return `${diffSeconds} seconds ago`;
        } else {
          return `${diffMinutes} minutes ago`;
        }
      } else {
        return 'Yesterday';
      }
    } else if (diffDays < 2) {
      return 'Yesterday';
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  }
  const renderItem = React.useCallback(
    ({item}) => {
      const sentByMe = currentUser.uid == item.senderId;
      const timeString = formatTimestamp(item?.date || 0);

      return (
        <View
          style={[
            !sentByMe ? styles.outGoingStyle : styles.incomingStyle,
            {width: width / 2},
          ]}
          key={item.id}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {route.params.userChats.type && (
                <Image
                  source={{uri: item.photoURL}}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    marginRight: 5,
                  }}
                />
              )}
              <Text style={{fontSize: 10, opacity: 0.5}}>
                {sentByMe ? 'You' : data.user.name}
              </Text>
            </View>

            <Text style={{fontSize: 10, opacity: 0.5}}>{timeString}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text>{item.text}</Text>
          </View>
        </View>
      );
    },
    [route],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1b1b1b',
      }}>
      <ChatHeader navigation={navigation} route={route} />
      <View style={{flex: 1}}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ref={flatListRef}
        />
      </View>
      <View style={styles.inputcontainer}>
        <View style={styles.inpurStyle}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            placeholder="Type your message here"
          />
        </View>

        <TouchableOpacity style={styles.iconContainer} onPress={handleSend}>
          <MaterialIcons size={24} name="send" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
  },

  incomingStyle: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    marginRight: 10,
    marginVertical: 10,
    padding: 5,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
  },
  outGoingStyle: {
    backgroundColor: 'white',
    marginLeft: 10,
    marginVertical: 10,
    padding: 5,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: theme.colors.dark,
    flex: 1,
    // borderRadius: 20,
    paddingHorizontal: 16,
    borderRadius: 50,
    fontSize: 16,
    color: 'white',
    // marginVertical: 10,
    // marginHorizontal: 20,
  },

  inpurStyle: {
    backgroundColor: theme.colors.dark,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 50,
    flex: 1,
  },
  inputcontainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    padding: 15,
    borderRadius: 50,
    backgroundColor: theme.colors.gray,
  },
});

export default Chat;
