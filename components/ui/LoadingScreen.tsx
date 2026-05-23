import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/theme';

interface LoadingScreenProps {
    color?: string;
    /** If true fills entire screen with dark background (used in dashboard) */
    fullscreen?: boolean;
}

export default function LoadingScreen({ color = Colors.brand, fullscreen = false }: LoadingScreenProps) {
    return (
        <View style={[styles.wrapper, fullscreen && styles.fullscreen]}>
            <ActivityIndicator size="large" color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fullscreen: { backgroundColor: Colors.dark },
});
