import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import ConfirmButton from '../../components/ui/ConfirmButton';
import LiftOffView from '../../components/ui/LiftOffView';
import OrderRow from '../../components/ui/OrderRow';
import PickupStockView from '../../components/ui/PickupStockView';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { Colors, shared } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

type ViewMode = 'list' | 'drop_input' | 'pickup_stock';

export default function OrdersScreen() {
    const [orders, setOrders]               = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [loading, setLoading]             = useState(false);
    const [viewMode, setViewMode]           = useState<ViewMode>('list');
    const [stock, setStock]                 = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('kiosk_submissions').select('*')
                .in('status', ['pending', 'in_progress']).order('created_at', { ascending: true });
            if (error) throw error;
            setOrders(data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchStockForPickup = async (order: any) => {
        if (!order.reference_number) return Alert.alert('Error', 'This pickup has no reference number.');
        setLoading(true);
        try {
            const { data: release, error } = await supabase.from('booking_releases').select('*')
                .ilike('reference', order.reference_number.trim()).eq('active', true).single();
            if (error || !release) {
                const { data: fallback } = await supabase.from('containers').select('*')
                    .ilike('customer', order.customer_id.trim()).eq('status', 'AI');
                setStock(fallback || []);
            } else {
                const { data: matched } = await supabase.from('containers').select('*')
                    .ilike('customer', release.customer.trim()).eq('type', release.type)
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
            await supabase.from('containers').update({ status: 'OUT', location: null }).eq('id', container.id);
            await supabase.from('kiosk_submissions').update({
                status: 'completed', container_prefix: container.prefix, container_number: container.number,
            }).eq('id', selectedOrder.id);
            if (selectedOrder.releaseInfo) {
                await supabase.from('booking_deliveries').insert([{
                    booking_id: selectedOrder.releaseInfo.id, container_id: container.id,
                }]);
            }
            Alert.alert('Success', `Container ${container.prefix} ${container.number} released.`);
            resetFlow();
        } catch { Alert.alert('Error', 'Could not process the operation.'); }
        finally { setLoading(false); }
    };

    const handleConfirmLiftOff = async (location: string) => {
        setLoading(true);
        try {
            await supabase.from('containers')
                .update({ status: 'AI', location })
                .eq('prefix', selectedOrder.container_prefix).eq('number', selectedOrder.container_number);
            await supabase.from('kiosk_submissions').update({ status: 'completed' }).eq('id', selectedOrder.id);
            Alert.alert('Success', 'Drop-off confirmed and yard position updated.');
            resetFlow();
        } catch { Alert.alert('Error', 'Could not process the operation.'); }
        finally { setLoading(false); }
    };

    const resetFlow = () => { setSelectedOrder(null); setViewMode('list'); fetchOrders(); };

    if (viewMode === 'pickup_stock') return (
        <PickupStockView
            customerId={selectedOrder?.customer_id}
            stock={stock}
            onBack={() => setViewMode('list')}
            onConfirm={handleConfirmPickup}
        />
    );

    if (viewMode === 'drop_input') return (
        <LiftOffView
            containerRef={`${selectedOrder?.container_prefix}${selectedOrder?.container_number}`}
            onBack={() => setViewMode('list')}
            onConfirm={handleConfirmLiftOff}
        />
    );

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
    footer:      { padding: 16, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#EEE' },
    footerLabel: { textAlign: 'center', marginBottom: 10, fontWeight: 'bold', color: Colors.textMuted, fontSize: 13 },
});
