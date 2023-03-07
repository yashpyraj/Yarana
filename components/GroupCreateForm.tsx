import React, {useState, useContext, useEffect, useMemo} from 'react';
import {AuthContext} from '../App';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Button,
} from 'react-native';
import Text from '../components/text';
import {Formik} from 'formik';
import firestore from '@react-native-firebase/firestore';
import MultiSelect from 'react-native-multiple-select';
import theme from './theme';

const GroupCreateForm = () => {
  const [groupName, setGroupName] = useState('');
  const [groupNameError, setGroupNameError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setallUsers] = useState([]);
  const {width} = useWindowDimensions();
  const {user} = useContext(AuthContext);
  const currentUser = useMemo(() => user._user, [user._user]);
  const validateGroupName = name => {
    if (!name) {
      return 'Group name is required';
    } else if (name.length < 3) {
      return 'Group name must be at least 3 characters long';
    } else {
      return null;
    }
  };
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('usersChat')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setallUsers(documentSnapshot.data());
        }
      });
    return unsubscribe;
  }, [currentUser.uid]);

  const createNewGroup = async (groupName, usersToAdd) => {
    const groupId = firestore().collection('chats').doc().id;
    await firestore().collection('chats').doc(groupId).set({
      groupName: groupName,
      messages: [],
      members: usersToAdd,
    });
    firestore()
      .collection('chats')
      .doc(groupId)
      .set({
        messages: [],
      })
      .then(() => {
        console.log('Chats added!');
      });
    // Add each user to the group's user list
    firestore()
      .collection('usersChat')
      .doc(currentUser.uid)
      .update({
        [groupId + '.userChats']: {
          type: 'group',
          uid: groupId,
          name: groupName,
        },
        [groupId + '.date']: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log('Me updated!');
      })
      .catch(err => {
        console.log(err);
      });
    for (const user of usersToAdd) {
      await firestore()
        .collection('usersChat')
        .doc(user)
        .update({
          [groupId + '.userChats']: {
            type: 'group',
            uid: groupId,
            name: groupName,
          },
          [groupId + '.date']: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log('User updated!');
        })
        .catch(err => {
          console.log(err);
        });

      // Add the group to the user's group list
    }
  };
  const handleSubmit = () => {
    const error = validateGroupName(groupName);
    setGroupNameError(error);
    if (!error && selectedUsers.length > 0) {
      createNewGroup(groupName, selectedUsers);
      // Reset form fields
      setGroupName('');
      setSelectedUsers([]);
    }
  };

  const data = Object.values(allUsers);
  console.log(data);

  const userChats = data
    .filter(chat => chat.userChats.type !== 'group')
    .map(chat => chat.userChats);

  return (
    <View style={{flex: 1, width: width - 30}}>
      <Text style={{color: 'white', marginVertical: 10, marginLeft: 5}}>
        Group Name
      </Text>
      <TextInput
        value={groupName}
        onChangeText={setGroupName}
        style={{
          backgroundColor: 'white',
          borderRadius: 50,
          color: 'black',
          padding: 10,
        }}
      />
      {groupNameError && <Text style={{color: 'red'}}>{groupNameError}</Text>}

      <Text style={{color: 'white', marginVertical: 10, marginLeft: 5}}>
        Select Users
      </Text>
      <View></View>
      <MultiSelect
        items={userChats}
        uniqueKey="uid"
        displayKey="name"
        onSelectedItemsChange={setSelectedUsers}
        selectedItems={selectedUsers}
        searchInputStyle={{
          backgroundColor: theme.colors.dark,
          borderRadius: 50,
          color: 'white',
          padding: 10,
        }}
        searchInputPlaceholderText="Select your friends"
        fontFamily="Jost-Regular"
        itemFontFamily="Jost-Regular"
        itemTextColor={theme.colors.white}
        selectedItemIconColor={theme.colors.primary}
        selectedItemTextColor={theme.colors.primary}
        styleDropdownMenu={{backgroundColor: theme.colors.dark}}
        styleDropdownMenuSubsection={{backgroundColor: theme.colors.dark}}
        styleItemsContainer={{backgroundColor: theme.colors.dark}}
        styleListContainer={{backgroundColor: theme.colors.dark}}
        styleMainWrapper={{
          backgroundColor: theme.colors.dark,
        }}
        styleSelectorContainer={{backgroundColor: theme.colors.dark}}
        styleInputGroup={{backgroundColor: theme.colors.dark}}
        submitButtonColor={theme.colors.gray}
        tagBorderColor={theme.colors.primary}
        tagRemoveIconColor={theme.colors.primary}
        tagTextColor={'white'}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: '#CBFF97',
          padding: 20,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
          borderRadius: 70,
          width: 150,
        }}>
        <Text style={{color: 'black', fontWeight: 900}}>Create 💥</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
});

export default GroupCreateForm;
