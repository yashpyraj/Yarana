import {View, Text} from 'react-native';
import React, {useContext, createContext, useReducer} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../App';
export const ChatContext: React.Context<{}> = createContext({});
type Children = {
  children: React.ReactNode;
};
export const ChatContextProvider = ({children}: Children) => {
  const {user} = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };
  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: action.payload,
          chatId: action.payload?.type
            ? action.payload.uid
            : user.uid > action.payload.uid
            ? user.uid + action.payload.uid
            : action.payload.uid + user.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{data: state, dispatch}}>
      {children}
    </ChatContext.Provider>
  );
};
