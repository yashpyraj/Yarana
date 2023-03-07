import React, {memo, useState, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Text from '../components/text';
import ChatList from '../components/chatList';
import theme from '../components/theme';
import {useNavigation} from '@react-navigation/native';
import UserSearch from './UserSearch';
import Animated, {FadeIn} from 'react-native-reanimated';
import GroupCreateForm from '../components/GroupCreateForm';

const HomeScreen = memo(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const navigation = useNavigation();
  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);
  const openModal1 = useCallback(() => setModalVisible1(true), []);
  const closeModal1 = useCallback(() => setModalVisible1(false), []);

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(1000)}>
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
      <Modal
        visible={modalVisible1}
        animationType="fade"
        hardwareAccelerated={true}
        onRequestClose={closeModal1}
        transparent={true}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={closeModal1} style={styles.closeButton}>
            <AntDesign name="close" size={25} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={{color: 'white', fontSize: 20}}>Create a Group</Text>

          <View style={[styles.container, {alignItems: 'center'}]}>
            <GroupCreateForm />
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={openModal1}>
        <Text style={[styles.addFriends, {marginLeft: 10}]}>Create group</Text>
      </TouchableOpacity>
      <ChatList />
    </Animated.View>
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
  input: {
    height: 40,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
});

export default HomeScreen;
