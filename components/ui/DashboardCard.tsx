import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/theme';

interface DashboardCardProps {
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: () => void;
}

export default function DashboardCard({ name, icon, color, onPress }: DashboardCardProps) {
    return (
        <TouchableOpacity
            style={[styles.card, { borderTopColor: color }]}
            onPress={onPress}
            activeOpacity={0.75}
        >
            <Ionicons name={icon} size={36} color={color} />
            <Text style={styles.label}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        width: '31.3%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1%',
        borderRadius: 3,
        borderTopWidth: 3,
        elevation: 2,
        gap: 6,
    },
    label: {
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.text,
        paddingHorizontal: 4,
        letterSpacing: 0.3,
    },
});
