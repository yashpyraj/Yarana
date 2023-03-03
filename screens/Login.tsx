import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ImageBackground,
  View,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Text from '../components/text';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
//#CBFF97

function Login(): JSX.Element {
  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState([]);
  const [err, setErr] = useState('');
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '546963471413-jp55nngev1m2hgtvcliqoun0hhrhklm9.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    const fcmToken = await messaging().getToken();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user._user;
    firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        fcmToken: fcmToken,
      })
      .then(() => {
        console.log('User added!');
      });
    const usersChat = await firestore()
      .collection('usersChat')
      .doc(user.uid)
      .get();
    if (!usersChat.exists) {
      firestore().collection('usersChat').doc(user.uid).set({});
    }
  }

  return (
    // <SafeAreaView>
    <ImageBackground
      style={styles.backgroundImage}
      source={require('../assets/bg.png')}>
      <View style={styles.container}>
        <Image
          style={{
            width: 200,
            height: 200,
          }}
          source={require('../assets/lodo.png')}
        />

        <View
          style={{
            backgroundColor: 'white',
            marginTop: 30,
            padding: 10,
            width: '60%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            margin: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 5,
            }}>
            <Text
              style={{
                color: 'black',
                fontWeight: 900,
              }}>
              @Yashraj
            </Text>
            <Text
              style={{
                color: 'black',
              }}>
              12:10AM
            </Text>
          </View>
          <View style={{padding: 5}}>
            <Text>
              Welcome to Yaarana!, a small chat app for our small chat group.
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onGoogleButtonPress}
            style={{
              backgroundColor: '#CBFF97',
              padding: 20,
              paddingHorizontal: 70,
              borderRadius: 70,
            }}>
            <Text style={{color: 'black', fontWeight: 900}}>
              Let's Start 💥
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Your content goes here */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 30,
    color: '#CBFF97',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 70,
    left: 0,
    right: 0,
    padding: 20,
  },
});
export default Login;
