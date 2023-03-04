import React from 'react';
import {Text, TextStyle} from 'react-native';

type CustomTextProps = {
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
};
const CustomText: React.FC<CustomTextProps> = ({
  children,
  style,
  numberOfLines,
}) => {
  return (
    <Text
      style={[{fontFamily: 'Jost-Regular', color: 'black'}, style]}
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};
export default CustomText;
