import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { shared } from '../../constants/theme';

interface LogoutButtonProps {
    message?: string;
    onConfirm: () => void;
    style?: object;
}

export default function LogoutButton({
    message = 'Are you sure you want to exit?',
    onConfirm,
    style,
}: LogoutButtonProps) {
    const confirm = () =>
        Alert.alert('Logout', message, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', style: 'destructive', onPress: onConfirm },
        ]);

    return (
        <TouchableOpacity style={[shared.logoutBtn, style]} onPress={confirm}>
            <Ionicons name="power" size={18} color="#FF4444" />
        </TouchableOpacity>
    );
}
