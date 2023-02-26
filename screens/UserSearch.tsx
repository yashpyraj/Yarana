import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import theme from '../components/theme';
type UserData = {
  id: string;
  name: string;
  email: string;
  photoURL: string;
};
import {AuthContext} from '../App';
import Text from '../components/text';

function UserSearch() {
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [err, setErr] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {userData, setUser} = useContext(AuthContext);
  console.log(userData);
  useEffect(() => {
    if (username === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    firestore()
      .collection('users')
      .where('name', '>=', username)
      .where('name', '<=', username + '\uf8ff')
      .get()
      .then(querySnapshot => {
        const results: UserData[] = [];
        querySnapshot.forEach(doc => {
          const userData = doc.data() as UserData;
          results.push(userData);
        });
        setSearchResults(results);
        setShowResults(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      })
      .catch(error => {
        console.log(error);
        setErr(error.message);
      });
  }, [username]);

  const renderItem = ({item}: {item: UserData}) => {
    return (
      <View style={styles.result}>
        <Image source={{uri: item.photoURL}} style={styles.image} />
        <View>
          <Text>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search to Add"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>
      {showResults && (
        <Animated.View style={[styles.results, {opacity: fadeAnim}]}>
          {err ? (
            <Text style={styles.error}>{err}</Text>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderItem}
              keyExtractor={item => item.photoURL}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.dark,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
  },
  input: {
    fontSize: 16,
    color: 'black',
  },
  results: {
    backgroundColor: '#FFFFFF',
  },
  result: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    marginRight: 10,
  },
});

export default UserSearch;
