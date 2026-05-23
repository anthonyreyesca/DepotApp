import React from 'react';
import { KeyboardTypeOptions, Text, TextInput } from 'react-native';
import { Colors, shared } from '../../constants/theme';

interface FormFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    maxLength?: number;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    secureTextEntry?: boolean;
    style?: object;
}

export default function FormField({
    label,
    value,
    onChangeText,
    placeholder,
    maxLength,
    keyboardType = 'default',
    autoCapitalize = 'characters',
    autoCorrect = false,
    secureTextEntry = false,
    style,
}: FormFieldProps) {
    return (
        <>
            {label ? <Text style={shared.formLabel}>{label}</Text> : null}
            <TextInput
                style={[shared.formInput, style]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={Colors.placeholder}
                maxLength={maxLength}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                secureTextEntry={secureTextEntry}
            />
        </>
    );
}
