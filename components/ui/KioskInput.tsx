import React from 'react';
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '../../constants/theme';

interface KioskInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: KeyboardTypeOptions;
    maxLength?: number;
    flex?: number;
    style?: object;
}

export default function KioskInput({
    placeholder,
    value,
    onChangeText,
    autoCapitalize = 'characters',
    keyboardType = 'default',
    maxLength,
    flex,
    style,
}: KioskInputProps) {
    return (
        <TextInput
            style={[styles.input, flex !== undefined && { flex }, style]}
            placeholder={placeholder}
            placeholderTextColor={Colors.placeholder}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            maxLength={maxLength}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#DDD',
    },
});
