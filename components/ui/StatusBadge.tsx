import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { shared } from '../../constants/theme';

const STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
    AV:  { color: '#006600', bg: '#CCFFCC', border: '#006600' },
    DAM: { color: '#880000', bg: '#FFCCCC', border: '#880000' },
    EXP: { color: '#B85C00', bg: '#FFF0DC', border: '#FF9800' },
    AI:  { color: '#0044AA', bg: '#DCE8FF', border: '#5577EE' },
    OUT: { color: '#555555', bg: '#E8E8E8', border: '#999999' },
};

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const upper = status?.toUpperCase();
    const colors = STATUS_COLORS[upper];

    if (!colors) {
        return <Text style={shared.tdText}>{upper}</Text>;
    }

    return (
        <Text style={[styles.base, { color: colors.color, backgroundColor: colors.bg, borderColor: colors.border }]}>
            {upper}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        borderWidth: 1,
        fontSize: 9,
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 2,
        overflow: 'hidden',
        textAlign: 'center',
        alignSelf: 'center',
    },
});
