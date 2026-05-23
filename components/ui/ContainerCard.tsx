import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

interface ContainerCardProps {
    prefix: string;
    number: string;
    subtitle: string;
    onPress?: () => void;
    right?: React.ReactNode;
}

export default function ContainerCard({ prefix, number, subtitle, onPress, right }: ContainerCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.8 : 1}>
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{prefix} {number}</Text>
                <Text style={styles.sub}>{subtitle}</Text>
            </View>
            {right && <View style={styles.right}>{right}</View>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
        borderWidth: 0.5,
        borderColor: '#DDD',
    },
    title: { fontSize: 17, fontWeight: 'bold', color: Colors.text },
    sub:   { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
    right: { alignItems: 'flex-end', flexDirection: 'row', gap: 8 },
});
