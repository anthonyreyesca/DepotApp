import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ConfirmButton from '../../components/ui/ConfirmButton';
import OrderRow from '../../components/ui/OrderRow';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { Colors, shared } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

type ViewMode = 'list' | 'drop_input' | 'pickup_stock';

export default function OrdersScreen() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [locationInput, setLocationInput] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [stock, setStock] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('kiosk_submissions').select('*')
                .in('status', ['pending', 'in_progress'])
                .order('created_at', { ascending: true });
            if (error) throw error;
            setOrders(data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchStockForPickup = async (order: any) => {
        if (!order.reference_number) return Alert.alert('Error', 'This pickup has no reference number.');
        setLoading(true);
        try {
            const { data: release, error: releaseErr } = await supabase
                .from('booking_releases').select('*')
                .ilike('reference', order.reference_number.trim()).eq('active', true).single();

            if (releaseErr || !release) {
                const { data: fallback } = await supabase.from('containers').select('*')
                    .ilike('customer', order.customer_id.trim()).eq('status', 'AI');
                setStock(fallback || []);
            } else {
                const { data: matched } = await supabase.from('containers').select('*')
                    .ilike('customer', release.customer.trim())
                    .eq('type', release.type)
                    .eq('status', release.status_required || 'AI');
                setSelectedOrder((prev: any) => ({ ...prev, releaseInfo: release }));
                setStock(matched || []);
            }
            setViewMode('pickup_stock');
        } catch { Alert.alert('Error', 'Could not load matching stock.'); }
        finally { setLoading(false); }
    };

    const handleConfirmPickup = async (container: any) => {
        setLoading(true);
        try {
            // 1. Mark container as OUT
            await supabase.from('containers')
                .update({ status: 'OUT', location: null }).eq('id', container.id);

            // 2. Close the kiosk submission
            await supabase.from('kiosk_submissions').update({
                status: 'completed',
                container_prefix: container.prefix,
                container_number: container.number,
            }).eq('id', selectedOrder.id);

            // 3. Insert delivery record — this is what booking-out reads to show history
            if (selectedOrder.releaseInfo) {
                await supabase.from('booking_deliveries').insert([{
                    booking_id: selectedOrder.releaseInfo.id,
                    container_id: container.id,
                }]);
                // amount_delivered is updated by the DB trigger tr_update_delivery_count
            }

            Alert.alert('Success', `Container ${container.prefix} ${container.number} released.`);
            resetFlow();
        } catch { Alert.alert('Error', 'Could not process the operation.'); }
        finally { setLoading(false); }
    };

    const handleConfirmLiftOff = async () => {
        if (!locationInput) return Alert.alert('Missing Position', 'Please enter a yard position.');
        setLoading(true);
        try {
            // Find container by prefix + number to get its id
            const { data: container, error: findError } = await supabase
                .from('containers')
                .select('id')
                .eq('prefix', selectedOrder.container_prefix.toUpperCase().trim())
                .eq('number', selectedOrder.container_number.trim())
                .maybeSingle();

            if (findError || !container) {
                Alert.alert('Container Not Found', 'Could not find the container in the system. Check the prefix and number.');
                setLoading(false);
                return;
            }

            await supabase.from('containers')
                .update({ status: 'AI', location: locationInput.toUpperCase().trim() })
                .eq('id', container.id);

            await supabase.from('kiosk_submissions')
                .update({ status: 'completed' })
                .eq('id', selectedOrder.id);

            Alert.alert('Success', 'Drop-off confirmed and yard position updated.');
            resetFlow();
        } catch { Alert.alert('Error', 'Could not process the operation.'); }
        finally { setLoading(false); }
    };

    const resetFlow = () => { setSelectedOrder(null); setViewMode('list'); setLocationInput(''); fetchOrders(); };

    // ── PICKUP STOCK VIEW ──
    if (viewMode === 'pickup_stock') return (
        <View style={shared.screen}>
            <ScreenHeader title={`AVAILABLE STOCK: ${selectedOrder?.customer_id}`} onBack={() => setViewMode('list')} />
            <FlatList
                data={stock}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.stockRow} onPress={() => handleConfirmPickup(item)}>
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

    // ── DROP INPUT VIEW ──
    if (viewMode === 'drop_input') return (
        <View style={shared.screen}>
            <ScreenHeader title="LIFT OFF — ASSIGN POSITION" onBack={() => setViewMode('list')} />
            <View style={styles.centerBox}>
                <Text style={styles.centerLabel}>
                    POSITION FOR: {selectedOrder?.container_prefix}{selectedOrder?.container_number}
                </Text>
                <TextInput
                    style={styles.locationInput}
                    placeholder="POSITION (e.g. A-12)"
                    placeholderTextColor={Colors.placeholder}
                    onChangeText={setLocationInput}
                    autoCapitalize="characters"
                />
                <ConfirmButton label="CONFIRM LIFT OFF" color={Colors.green} onPress={handleConfirmLiftOff} style={{ width: '100%' }} />
                <TouchableOpacity onPress={() => setViewMode('list')} style={{ marginTop: 20 }}>
                    <Text style={{ color: Colors.red, fontWeight: 'bold' }}>CANCEL</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // ── MAIN LIST VIEW ──
    return (
        <View style={shared.screen}>
            <ScreenHeader title="PENDING ORDERS" onBack={() => router.replace('/dashboard')} rightIcon="refresh" onRightPress={fetchOrders} />
            <FlatList
                data={orders}
                keyExtractor={(item) => String(item.id)}
                onRefresh={fetchOrders}
                refreshing={loading}
                renderItem={({ item }) => (
                    <OrderRow
                        truckPlate={item.truck_plate}
                        transportCompany={item.transport_company}
                        operationType={item.operation_type}
                        customerId={item.customer_id}
                        selected={selectedOrder?.id === item.id}
                        onPress={() => setSelectedOrder(item)}
                    />
                )}
                ListEmptyComponent={<Text style={shared.emptyText}>No pending orders.</Text>}
            />
            {selectedOrder && (
                <View style={styles.footer}>
                    <Text style={styles.footerLabel}>
                        {selectedOrder.operation_type === 'PICKUP'
                            ? `REF: ${selectedOrder.reference_number}`
                            : `CONT: ${selectedOrder.container_prefix}${selectedOrder.container_number}`}
                    </Text>
                    <ConfirmButton
                        label={selectedOrder.operation_type === 'PICKUP' ? 'VIEW AVAILABLE STOCK' : 'LIFT OFF TRUCK'}
                        color={selectedOrder.operation_type === 'PICKUP' ? Colors.brand : Colors.orange}
                        onPress={() => selectedOrder.operation_type === 'PICKUP' ? fetchStockForPickup(selectedOrder) : setViewMode('drop_input')}
                        style={{ width: '100%' }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    stockRow: { flexDirection: 'row', padding: 18, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center' },
    plate: { fontSize: 17, fontWeight: 'bold', color: Colors.text },
    sub: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
    centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    centerLabel: { fontWeight: 'bold', fontSize: 14, color: Colors.text, marginBottom: 16, textAlign: 'center' },
    locationInput: { width: '100%', padding: 16, backgroundColor: '#EEE', borderRadius: 5, marginBottom: 20, fontSize: 22, textAlign: 'center', fontWeight: 'bold' },
    footer: { padding: 16, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#EEE' },
    footerLabel: { textAlign: 'center', marginBottom: 10, fontWeight: 'bold', color: Colors.textMuted, fontSize: 13 },
});
