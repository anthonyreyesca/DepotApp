import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

interface OrderRowProps {
    truckPlate: string;
    transportCompany: string;
    operationType: 'PICKUP' | 'DROP OFF' | string;
    customerId: string;
    selected?: boolean;
    onPress: () => void;
}

export default function OrderRow({
    truckPlate,
    transportCompany,
    operationType,
    customerId,
    selected = false,
    onPress,
}: OrderRowProps) {
    const typeColor = operationType === 'PICKUP' ? Colors.brand : Colors.green;

    return (
        <TouchableOpacity
            style={[styles.row, selected && styles.rowSelected]}
            onPress={onPress}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.plate}>{truckPlate}</Text>
                <Text style={styles.sub}>{transportCompany}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.type, { color: typeColor }]}>{operationType}</Text>
                <Text style={styles.customer}>{customerId}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        padding: 18,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    rowSelected: {
        backgroundColor: '#FFF4E5',
        borderLeftWidth: 4,
        borderLeftColor: Colors.orange,
    },
    plate:    { fontSize: 17, fontWeight: 'bold', color: Colors.text },
    sub:      { fontSize: 12, color: Colors.textLight, marginTop: 2 },
    type:     { fontSize: 10, fontWeight: 'bold' },
    customer: { fontWeight: 'bold', fontSize: 13, color: Colors.text },
});
