import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  iconName,
  isPassword,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusAnim = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
    if (onBlur) onBlur(e);
  };

  const animatedBorder = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      [error ? '#FF3B30' : '#E5E5EA', error ? '#FF3B30' : '#007AFF']
    );
    return {
      borderColor,
      borderWidth: focusAnim.value ? 2 : 1.5,
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.inputContainer, animatedBorder]}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={isFocused ? '#007AFF' : '#8E8E93'}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, iconName ? { paddingLeft: 8 } : {}]}
          placeholderTextColor="#8E8E93"
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A3A3C',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    height: '100%',
  },
  leftIcon: {
    marginRight: 4,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
