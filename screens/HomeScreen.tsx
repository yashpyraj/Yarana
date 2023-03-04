import React, {memo, useState, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Text from '../components/text';
import ChatList from '../components/chatList';
import theme from '../components/theme';
import {useNavigation} from '@react-navigation/native';
import UserSearch from './UserSearch';

const HomeScreen = memo(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.openDrawer()}>
          <AntDesign name="left" size={25} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openModal}>
          <Text style={styles.addFriends}>Add Friends</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        hardwareAccelerated={true}
        onRequestClose={closeModal}
        transparent={true}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <AntDesign name="close" size={25} color={theme.colors.primary} />
          </TouchableOpacity>
          <UserSearch closeModal={closeModal} />
        </View>
      </Modal>
      <ChatList />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  backButton: {
    backgroundColor: theme.colors.gray,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriends: {
    color: theme.colors.primary,
  },
  modal: {
    backgroundColor: theme.colors.dark,
    alignSelf: 'center',
    flex: 1,
    width: '100%',
    paddingTop: 20,
    padding: 10,
    elevation: 5,
  },
  closeButton: {
    borderRadius: 20,
    padding: 10,
    alignSelf: 'flex-end',
  },
});

export default HomeScreen;
