import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { shared } from '../../constants/theme';

interface ConfirmButtonProps {
    label: string;
    loadingLabel?: string;
    loading?: boolean;
    color: string;
    onPress: () => void;
    style?: object;
}

export default function ConfirmButton({
    label,
    loadingLabel = 'PROCESSING...',
    loading = false,
    color,
    onPress,
    style,
}: ConfirmButtonProps) {
    return (
        <TouchableOpacity
            style={[shared.confirmBtn, { backgroundColor: color }, loading && { opacity: 0.65 }, style]}
            onPress={onPress}
            disabled={loading}
        >
            {loading
                ? <ActivityIndicator color="#FFF" />
                : <Text style={shared.confirmBtnText}>{label}</Text>
            }
        </TouchableOpacity>
    );
}
