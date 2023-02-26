import React from 'react';
import {TouchableOpacity} from 'react-native';
import Text from '../components/text';

interface Props {
  active: boolean;
  icon?: string;
  children: React.ReactNode;
  onPress: () => void;
}

const MenuButton = ({active, icon, children, onPress, ...props}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        // backgroundColor: active ? undefined : 'transparent',
        justifyContent: 'flex-start',
        backgroundColor: '#2e2e2e',
        paddingVertical: 10,
        paddingHorizontal: 60,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: active ? '#CBFF97' : 'black',
      }}>
      <Text style={{color: 'white'}}>{children}</Text>
    </TouchableOpacity>
  );
};

export default MenuButton;
