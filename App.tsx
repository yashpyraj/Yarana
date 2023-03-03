import React, {useContext, createContext, useState, useEffect} from 'react';
import AppContaner from './components/app-container';
import auth from '@react-native-firebase/auth';
import HomeScreen from './screens/HomeScreen';
import About from './screens/About';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Login from './screens/Login';
import Sidebar from './screens/Sidebar';
import {ChatContextProvider} from './components/userContext';
import Chat from './screens/Chat';

type Children = {
  children: React.ReactNode;
};
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
export const AuthContext = createContext({});

const AuthUserProvider = ({children}: Children) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

function ChatStack(): JSX.Element {
  return (
    <Drawer.Navigator
      drawerContent={props => <Sidebar {...props} />}
      initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        // component={HomeScreen}
        component={() => {
          return <HomeScreen />;
        }}
        options={{
          title: 'Chats',
          headerStyle: {
            backgroundColor: '#1b1b1b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Jost-Regular',
          },
        }}
      />
      <Drawer.Screen
        name="About"
        component={() => {
          return <About />;
        }}
        options={{
          title: 'About',
          headerStyle: {
            backgroundColor: '#1b1b1b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Jost-Regular',
          },
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

function WelcomeScreen(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={Login}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
function RootNavigator(): JSX.Element {
  const {user, setUser} = useContext(AuthContext);
  function onAuthStateChanged(user) {
    setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return <AppContaner>{user ? <ChatStack /> : <WelcomeScreen />}</AppContaner>;
}

function App(): JSX.Element {
  return (
    <AuthUserProvider>
      <ChatContextProvider>
        <RootNavigator />
      </ChatContextProvider>
    </AuthUserProvider>
  );
}

export default App;
