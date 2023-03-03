import React, {useMemo, useCallback, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Text from '../components/text';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import MenuButton from '../components/MenuButton';
import {AuthContext} from '../App';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import theme from '../components/theme';
import LottieView from 'lottie-react-native';

const Sidebar = ({state, navigation}: DrawerContentComponentProps) => {
  const currentRoute = state.routeNames[state.index];
  const {user, setUser} = useContext(AuthContext);

  const handlePressBackButton = useCallback(() => {
    navigation.closeDrawer();
  }, [navigation]);

  const handlePressMenuMain = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const handlePressMenuAbout = useCallback(() => {
    navigation.navigate('About');
  }, [navigation]);

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => alert('Your are signed out!'));
      // setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };

  const menuItems = useMemo(
    () => [
      {
        key: 'tasks',
        title: 'Tasks',
        icon: 'inbox',
      },
      {
        key: 'about',
        title: 'About',
        icon: 'info',
      },
    ],
    [],
  );

  const renderMenuItem = useCallback(
    ({item}) => (
      <MenuButton
        active={currentRoute === item.key}
        onPress={
          item.key === 'tasks' ? handlePressMenuMain : handlePressMenuAbout
        }
        icon={item.icon}>
        {item.title}
      </MenuButton>
    ),
    [currentRoute, handlePressMenuAbout, handlePressMenuMain],
  );

  const keyExtractor = useCallback(item => item.key, []);

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{uri: user._user.photoURL}}
        />
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={keyExtractor}
        style={styles.menuContainer}
      />

      <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>SignOut</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e2e2e',
    borderRightWidth: 1,
    borderColor: '#CBFF97',
    padding: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 70,
    height: 70,
    borderRadius: 9999,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#CBFF97',
  },
  profileImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    flex: 1,
    marginTop: 50,
    marginBottom: 50,
  },
  signOutButton: {
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  signOutButtonText: {
    color: 'black',
  },
  lottieContainer: {
    position: 'absolute',
    bottom: 30,
    justifyContent: 'flex-end',
    width: '105%',
    height: 220,
  },
});

export default Sidebar;
