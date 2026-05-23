import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, shared } from '../../constants/theme';

interface DeliveryDetail {
    delivered_at: string;
    containers: { prefix: string; number: string; type: string } | null;
}

interface BookingOutRowProps {
    item: any;
    colWidths: readonly string[];
    isSelected: boolean;
    shippedContainers: DeliveryDetail[];
    loadingDetails: boolean;
    onPress: () => void;
}

export default function BookingOutRow({
    item,
    colWidths,
    isSelected,
    shippedContainers,
    loadingDetails,
    onPress,
}: BookingOutRowProps) {
    const isInactive = item.active === false;
    const isFull = !isInactive && item.amount_delivered >= item.amount_requested;

    return (
        <View>
            <TouchableOpacity
                style={[shared.tableRow, isSelected && shared.tableRowSelected, isInactive && shared.tableRowInactive]}
                onPress={onPress}
            >
                <View style={[shared.td, { width: colWidths[0] }]}>
                    <Text style={[shared.tdText, isInactive && shared.tdTextInactive]}>{item.reference}</Text>
                </View>
                <View style={[shared.td, { width: colWidths[1] }]}>
                    <Text style={[shared.tdText, isInactive && shared.tdTextInactive]}>{item.type}</Text>
                </View>
                <View style={[shared.td, { width: colWidths[2] }]}>
                    <Text style={[shared.tdText, isInactive && shared.tdTextInactive]}>{item.status_required}</Text>
                </View>
                <View style={[shared.td, { width: colWidths[3] }]}>
                    <Text style={[shared.tdText, isInactive && shared.tdTextInactive]} numberOfLines={1}>{item.customer}</Text>
                </View>
                <View style={[shared.td, { width: colWidths[4], borderRightWidth: 0 }]}>
                    <Text style={[shared.tdText, isInactive && shared.tdTextInactive, isFull && styles.fullText]}>
                        {item.amount_delivered} / {item.amount_requested}
                    </Text>
                </View>
            </TouchableOpacity>

            {isSelected && (
                <View style={[styles.detailPane, isInactive && { backgroundColor: '#BBB' }]}>
                    <Text style={styles.detailTitle}>RELEASED CONTAINERS HISTORY:</Text>
                    {loadingDetails ? (
                        <ActivityIndicator color={Colors.brand} style={{ marginVertical: 10 }} />
                    ) : shippedContainers.length > 0 ? (
                        shippedContainers.map((d, i) => (
                            <View key={i} style={styles.detailRow}>
                                <Text style={[styles.containerRef, isInactive && { color: '#333' }]}>
                                    • {d.containers?.prefix}{d.containers?.number} ({d.containers?.type})
                                </Text>
                                <Text style={styles.dateText}>
                                    {new Date(d.delivered_at).toLocaleDateString()}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={shared.emptyText}>No containers linked to this release.</Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fullText:     { color: '#007700', fontWeight: 'bold' },
    detailPane:   { backgroundColor: '#F0F0F0', padding: 12, borderBottomWidth: 2, borderBottomColor: Colors.brand },
    detailTitle:  { fontWeight: 'bold', marginBottom: 8, fontSize: 11, color: '#222', letterSpacing: 0.4 },
    detailRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    containerRef: { fontSize: 14, color: '#0044CC', fontWeight: 'bold' },
    dateText:     { fontSize: 11, color: '#555' },
});
