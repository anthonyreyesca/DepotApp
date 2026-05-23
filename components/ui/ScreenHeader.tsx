import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors, shared } from '../../constants/theme';

interface ScreenHeaderProps {
    title: string;
    onBack?: () => void;
    backLabel?: string;
    /** Icon shown in the right slot (e.g. 'refresh', 'power') */
    rightIcon?: keyof typeof Ionicons.glyphMap;
    rightIconColor?: string;
    onRightPress?: () => void;
}

export default function ScreenHeader({
    title,
    onBack,
    backLabel = '◀ BACK',
    rightIcon,
    rightIconColor = Colors.orange,
    onRightPress,
}: ScreenHeaderProps) {
    return (
        <View style={shared.header}>
            {onBack && (
                <TouchableOpacity style={shared.backBtn} onPress={onBack}>
                    <Text style={shared.backBtnText}>{backLabel}</Text>
                </TouchableOpacity>
            )}
            <Text style={shared.headerTitle}>{title}</Text>
            {rightIcon && onRightPress && (
                <TouchableOpacity style={shared.logoutBtn} onPress={onRightPress}>
                    <Ionicons name={rightIcon} size={18} color={rightIconColor} />
                </TouchableOpacity>
            )}
        </View>
    );
}
