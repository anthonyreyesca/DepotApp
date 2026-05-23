import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from './ScreenHeader';
import { Colors, shared } from '../../constants/theme';

interface StockItem {
    id: any;
    prefix: string;
    number: string;
    type: string;
    location: string | null;
}

interface PickupStockViewProps {
    customerId: string;
    stock: StockItem[];
    onBack: () => void;
    onConfirm: (container: StockItem) => void;
}

export default function PickupStockView({ customerId, stock, onBack, onConfirm }: PickupStockViewProps) {
    return (
        <View style={shared.screen}>
            <ScreenHeader title={`AVAILABLE STOCK: ${customerId}`} onBack={onBack} />
            <FlatList
                data={stock}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.row} onPress={() => onConfirm(item)}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.plate}>{item.prefix} {item.number}</Text>
                            <Text style={styles.sub}>Type: {item.type} | Position: {item.location || 'Not set'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={shared.emptyText}>No matching containers in stock.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row:   { flexDirection: 'row', padding: 18, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center' },
    plate: { fontSize: 17, fontWeight: 'bold', color: Colors.text },
    sub:   { fontSize: 13, color: Colors.textLight, marginTop: 2 },
});
