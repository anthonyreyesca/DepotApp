import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FormRow from '../../components/ui/FormRow';
import KioskInput from '../../components/ui/KioskInput';
import LogoutButton from '../../components/ui/LogoutButton';
import { supabase } from '../../lib/supabase';

type OpType = 'PICKUP' | 'DROP OFF' | null;

const EMPTY_FORM = {
    truck_plate: '', transport_company: '', driver_name: '',
    container_prefix: '', container_number: '', reference_number: '',
};

export default function KioskScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [opType, setOpType] = useState<OpType>(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const set = (key: keyof typeof EMPTY_FORM, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        if (!form.truck_plate || !form.transport_company || !form.driver_name) {
            return Alert.alert('Missing Info', 'Truck plate, Transport Company and Driver Name are required.');
        }
        setLoading(true);
        let finalCustomerId = '';
        try {
            if (opType === 'PICKUP') {
                if (!form.reference_number) {
                    setLoading(false);
                    return Alert.alert('Missing Info', 'Booking Reference is required.');
                }
                const { data: release, error } = await supabase
                    .from('booking_releases')
                    .select('customer, active, amount_requested, amount_delivered')
                    .ilike('reference', form.reference_number.trim())
                    .eq('active', true)
                    .single();
                if (error || !release) {
                    setLoading(false);
                    return Alert.alert('Invalid Reference', 'This Booking Reference does not exist or is not active.');
                }

                const { count: pendingCount } = await supabase
                    .from('kiosk_submissions')
                    .select('*', { count: 'exact', head: true })
                    .eq('reference_number', form.reference_number.toUpperCase())
                    .in('status', ['pending', 'in_progress']);

                if (release.amount_requested <= (release.amount_delivered + pendingCount)) {
                    setLoading(false)
                    return Alert.alert(
                        'Reference Full',
                        'This booking reference has no remaining capacity - all containers are already delivered or pending.'
                    );
                }

                finalCustomerId = release.customer;
            }
            if (opType === 'DROP OFF') {
                if (!form.container_prefix || !form.container_number) {
                    setLoading(false);
                    return Alert.alert('Missing Info', 'Container prefix and number are required.');
                }
                const { data: container, error } = await supabase
                    .from('containers')
                    .select('customer')
                    .eq('prefix', form.container_prefix.toUpperCase().trim()).eq('number', form.container_number.trim()).single();
                if (error || !container) {
                    setLoading(false);
                    return Alert.alert('Container Not Found', 'This container is not registered. Please check with your operator.');
                }
                finalCustomerId = container.customer;
            }
            const { error } = await supabase
                .from('kiosk_submissions')
                .insert([{
                    truck_plate: form.truck_plate.toUpperCase(),
                    transport_company: form.transport_company.toUpperCase(),
                    driver_name: form.driver_name,
                    customer_id: finalCustomerId,
                    operation_type: opType,
                    reference_number: opType === 'PICKUP' ? form.reference_number.toUpperCase() : null,
                    container_prefix: form.container_prefix.toUpperCase() || null,
                    container_number: form.container_number || null,
                    status: 'pending',
                }]);
            if (error) throw error;
            Alert.alert('Submitted', 'Registration complete. Please wait for operator instructions.');
            setForm(EMPTY_FORM); setOpType(null);
        } catch (err: any) {
            Alert.alert('Database Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── SELECTOR ──
    if (!opType) return (
        <View style={styles.selector}>
            <LogoutButton
                message="Are you sure you want to exit the kiosk?"
                onConfirm={async () => { await supabase.auth.signOut(); router.replace('/login'); }}
                style={styles.logoutBtn}
            />
            <View style={styles.selectorContent}>
                <Text style={styles.title}>WELCOME</Text>
                <TouchableOpacity style={[styles.bigBtn, { backgroundColor: '#4CAF50' }]} onPress={() => setOpType('DROP OFF')}>
                    <Text style={styles.bigBtnText}>DROP OFF — CONTAINER DELIVERY</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bigBtn, { backgroundColor: '#2196F3' }]} onPress={() => setOpType('PICKUP')}>
                    <Text style={styles.bigBtnText}>PICK UP — CONTAINER COLLECTION</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // ── FORM ──
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.formTitle}>
                    {opType === 'DROP OFF' ? 'DROP OFF REGISTRATION' : 'PICK UP REGISTRATION'}
                </Text>

                <KioskInput placeholder="TRUCK PLATE" value={form.truck_plate} onChangeText={(t) => set('truck_plate', t.toUpperCase())} />
                <KioskInput placeholder="TRANSPORT COMPANY" value={form.transport_company} onChangeText={(t) => set('transport_company', t)} autoCapitalize="words" />
                <KioskInput placeholder="DRIVER NAME" value={form.driver_name} onChangeText={(t) => set('driver_name', t)} autoCapitalize="words" />

                {opType === 'DROP OFF' && (
                    <FormRow gap={10}>
                        <KioskInput placeholder="PREFIX" value={form.container_prefix} onChangeText={(t) => set('container_prefix', t.toUpperCase())} maxLength={4} flex={0.4} />
                        <KioskInput placeholder="NUMBER" value={form.container_number} onChangeText={(t) => set('container_number', t)} keyboardType="numeric" maxLength={7} flex={0.6} />
                    </FormRow>
                )}

                {opType === 'PICKUP' && (
                    <KioskInput placeholder="BOOKING REFERENCE" value={form.reference_number} onChangeText={(t) => set('reference_number', t.toUpperCase())} />
                )}

                <TouchableOpacity style={[styles.submitBtn, { backgroundColor: loading ? '#CCC' : '#000' }]} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.submitBtnText}>{loading ? 'VALIDATING...' : 'CONFIRM'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpType(null)} style={styles.cancel}>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>CANCEL — GO BACK</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    selector: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
    selectorContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logoutBtn: { alignSelf: 'flex-end', marginTop: 10 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
    bigBtn: { width: '100%', padding: 40, borderRadius: 15, marginBottom: 20, alignItems: 'center', elevation: 5 },
    bigBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    form: { padding: 30, paddingTop: 40 },
    formTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
    submitBtn: { padding: 20, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    submitBtnText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    cancel: { marginTop: 30, alignItems: 'center' },
});
