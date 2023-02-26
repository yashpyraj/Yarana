import React, {useCallback, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import MenuButton from '../components/MenuButton';
import {AuthContext} from '../App';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import LottieView from 'lottie-react-native';
const LottieView = require('lottie-react-native');

const Sidebar = (props: DrawerContentComponentProps) => {
  const {state, navigation} = props;
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
  {
    /* <IconButton
            onPress={handlePressBackButton}
            borderRadius={100}
            variant="outline"
            borderColor={useColorModeValue('blue.300', 'darkBlue.700')}
            _icon={{
              as: Feather,
              name: 'chevron-left',
              size: 6,
              color: useColorModeValue('blue.800', 'darkBlue.700'),
            }}
          /> */
  }

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

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={{
        flex: 1,
        backgroundColor: '#2e2e2e',
        borderRightWidth: 1,
        borderColor: '#CBFF97',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 50,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={[styles.container, {width: 70, height: 70}]}>
          <Image style={styles.image} source={{uri: user._user.photoURL}} />
        </View>
        <TouchableOpacity
          onPress={signOut}
          style={{
            backgroundColor: '#CBFF97',
            padding: 20,
            paddingHorizontal: 70,
            borderRadius: 70,
          }}>
          <Text style={{color: 'black'}}>signOut</Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1, marginTop: 50, marginBottom: 50}}>
        <MenuButton
          active={currentRoute === 'Home'}
          onPress={handlePressMenuMain}
          icon="inbox">
          Tasks
        </MenuButton>
        <MenuButton
          active={currentRoute === 'About'}
          onPress={handlePressMenuAbout}
          icon="info">
          About
        </MenuButton>
      </View>
      <View style={styles.lottieContainer}>
        <LottieView source={require('../assets/lotti.json')} autoPlay loop />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999, // a large number to make it a perfect circle
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#CBFF97',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
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
