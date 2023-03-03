import {View, TextInput, Button} from 'react-native';
import React, {useContext, useState, useEffect, useMemo} from 'react';
import Text from '../components/text';
import ChatHeader from '../components/ChatHeader';
import {ChatContext} from '../components/userContext';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../App';
import {generateRandomId} from '../utits/id';

interface IMessage {
  id: string;
  senderId: string;
  text: string;
  date: number;
}

const Chat = ({navigation, route}: {navigation: any; route: any}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState<string>('');
  const {data} = useContext(ChatContext);
  const {user} = useContext(AuthContext);
  const currentUser = useMemo(() => user._user, [user._user]);

  useEffect(() => {
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

  const handleSend = () => {
    // Handle sending the message
    const trimmedMessage = text.trim();
    if (trimmedMessage === '') {
      return;
    }
    const newMessage: IMessage = {
      id: generateRandomId(),
      senderId: currentUser.uid,
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

    // Reset the input field
    setText('');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#1b1b1b'}}>
      <ChatHeader navigation={navigation} route={route} />
      <View style={{flex: 1}}>
        {messages.map((message: IMessage) => (
          <View key={message.id}>
            <Text style={{color: 'white'}}>{message.text}</Text>
          </View>
        ))}
      </View>

      <View>
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          placeholder="Type your message here"
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

export default Chat;
