import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

type Props = {
  children: React.ReactNode;
};

function AppContaner(props: Props) {
  return <NavigationContainer>{props.children}</NavigationContainer>;
}

export default AppContaner;
