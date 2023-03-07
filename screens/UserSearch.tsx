import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import theme from '../components/theme';
import {AuthContext} from '../App';
import Text from '../components/text';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

type MyFunctionType = () => void;

type UserData = {
  name: string;
  email: string;
  photoURL: string;
  uid: string;
};

const UserSearch = React.memo(({closeModal}) => {
  const {user} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim1 = useRef(new Animated.Value(0)).current;

  const currentUser = useMemo(() => user._user, [user._user]);
  useEffect(() => {
    if (!username) {
      setSearchResults([]);
      setShowResults(false);
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
      return;
    }

    const searchUsers = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('users')
          .where('name', '>=', username)
          .where('name', '<=', username + '\uf8ff')

          .get();

        const results: UserData[] = [];
        querySnapshot.forEach(doc => {
          const userData = doc.data() as UserData;
          if (userData.uid !== currentUser.uid) {
            results.push(userData);
          }
        });
        setSearchResults(results);
        setShowResults(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnim1, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };

    searchUsers();
  }, [username, fadeAnim]);

  const renderItem = useCallback(
    ({item}: {item: UserData}) => {
      const onSelect = async () => {
        console.log(currentUser, item);
        // code to handle selection of the user item
        const combinedId =
          currentUser.uid > item.uid
            ? currentUser.uid + item.uid
            : item.uid + currentUser.uid;

        try {
          const user = await firestore()
            .collection('chats')
            .doc(combinedId)
            .get();
          if (!user.exists) {
            firestore()
              .collection('chats')
              .doc(combinedId)
              .set({
                messages: [],
              })
              .then(() => {
                console.log('Chats added!');
              });
            firestore()
              .collection('usersChat')
              .doc(currentUser.uid)
              .update({
                [combinedId + '.userChats']: {
                  uid: item.uid,
                  name: item.name,
                  photoURL: item.photoURL,
                },
                [combinedId + '.date']: firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                console.log('User updated!');
              });
            firestore()
              .collection('usersChat')
              .doc(item.uid)
              .update({
                [combinedId + '.userChats']: {
                  uid: currentUser.uid,
                  name: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                },
                [combinedId + '.date']: firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                console.log('User updated!');
              });
          }
        } catch (error) {
          console.log(error);
        }
        console.log('Selected user:', item);
        setUsername('');
        closeModal();
      };

      return (
        <TouchableOpacity style={styles.result} onPress={onSelect}>
          <View style={styles.row}>
            <Image source={{uri: item.photoURL}} style={styles.image} />
            <View>
              <Text style={styles.white}>{item.name}</Text>
              <Text style={styles.white}>{item.email}</Text>
            </View>
          </View>
          <EvilIcons name="plus" style={styles.icon} size={27} />
        </TouchableOpacity>
      );
    },
    [currentUser],
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search to Add"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="black"
          style={styles.input}
        />
      </View>
      {showResults && (
        <Animated.View style={[styles.results, {opacity: fadeAnim}]}>
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderItem}
              keyExtractor={item => item.photoURL}
            />
          )}
        </Animated.View>
      )}

      <Animated.View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          opacity: fadeAnim1,
        }}>
        <Text style={styles.white}>
          * To search for your friend's name, please ensure that you type it
          correctly, as it is case-sensitive matters. Additionally, please
          search for my name,{' '}
          <Text style={{color: theme.colors.primary}}>Yash raj</Text>.
        </Text>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    backgroundColor: theme.colors.dark,
    marginTop: -20,
    padding: 10,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  inputContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 2,
    paddingStart: 5,
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    color: theme.colors.dark,
  },
  results: {
    backgroundColor: theme.colors.gray,
    borderRadius: 10,
    margin: 20,
  },
  result: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.dark,
    justifyContent: 'space-between',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  white: {
    color: 'white',
    marginHorizontal: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: theme.colors.primary,
  },
});

export default UserSearch;
