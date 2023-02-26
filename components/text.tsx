import React from 'react';
import {Text, TextStyle} from 'react-native';

type CustomTextProps = {
  style?: TextStyle;
  children: React.ReactNode;
};

const CustomText: React.FC<CustomTextProps> = ({children, style}) => {
  return (
    <Text style={[{fontFamily: 'Jost-Regular', color: 'black'}, style]}>
      {children}
    </Text>
  );
};

export default CustomText;
