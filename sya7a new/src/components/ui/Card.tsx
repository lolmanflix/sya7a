import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

export interface CardProps extends ViewProps {
  style?: ViewStyle;
  children: React.ReactNode;
  animated?: boolean;
  delay?: number;
}

export const Card: React.FC<CardProps> = ({ style, children, animated = false, delay = 0, ...props }) => {
  const { theme } = useTheme();
  const cardStyle = [styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, style];

  if (animated) {
    return (
      <Animated.View
        entering={FadeInUp.delay(delay).duration(400).springify()}
        style={cardStyle}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
});
