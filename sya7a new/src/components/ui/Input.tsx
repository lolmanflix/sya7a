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
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';

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
  style,
  ...props
}) => {
  const { theme, mode } = useTheme();
  const { isRTL } = useI18n();
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

  const isDark = mode === 'dark';
  const defaultBorder = isDark ? '#2A2A2E' : '#E5E5EA';
  const activeBorder = theme.colors.primary || '#007AFF';

  const animatedBorder = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      [error ? '#FF3B30' : defaultBorder, error ? '#FF3B30' : activeBorder]
    );
    return {
      borderColor,
      borderWidth: focusAnim.value ? 2 : 1.5,
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
          animatedBorder,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={isFocused ? (theme.colors.primary || '#007AFF') : theme.colors.muted}
            style={isRTL ? styles.rightIcon : styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              textAlign: isRTL ? 'right' : 'left',
            },
            iconName ? (isRTL ? { paddingRight: 8 } : { paddingLeft: 8 }) : {},
            style,
          ]}
          placeholderTextColor={theme.colors.muted}
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
              color={theme.colors.muted}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {error}
        </Text>
      )}
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
    marginBottom: 8,
    marginHorizontal: 4,
  },
  inputContainer: {
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 4,
  },
});
