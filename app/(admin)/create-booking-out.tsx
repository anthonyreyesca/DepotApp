import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import ConfirmButton from '../../components/ui/ConfirmButton';
import FormField from '../../components/ui/FormField';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SelectorChips from '../../components/ui/SelectorChips';
import { CONTAINER_TYPES, CUSTOMERS } from '../../constants/logistics';
import { Colors, shared } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

const TYPE_OPTIONS = CONTAINER_TYPES.map((t) => ({ id: t, label: t }));
const CUSTOMER_OPTIONS = CUSTOMERS.map((c) => ({ id: c.id, label: c.name }));
const CONDITION_OPTIONS = [
    { id: 'AV', label: 'AVAILABLE (AV)' },
    { id: 'DAM', label: 'DAMAGED (DAM)' },
];

export default function CreateBookingOut() {
    const router = useRouter();
    const [bookingRef, setBookingRef] = useState('');
    const [customer, setCustomer] = useState<string>(CUSTOMERS[0].id);
    const [type, setType] = useState<string>(CONTAINER_TYPES[0]);
    const [status, setStatus] = useState<'AV' | 'DAM'>('AV');
    const [amount, setAmount] = useState('1');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const qty = parseInt(amount);
        if (!bookingRef.trim()) { Alert.alert('Error', 'Please enter a Booking Reference.'); return; }
        if (isNaN(qty) || qty <= 0) { Alert.alert('Error', 'Quantity must be at least 1.'); return; }

        setLoading(true);
        const { data: existing } = await supabase.from('booking_releases')
            .select('id').ilike('reference', bookingRef.trim()).maybeSingle();
        if (existing) {
            Alert.alert('Already Exists', `Reference ${bookingRef.toUpperCase()} already exists in the system.`);
            setLoading(false);
            return;
        }
        const { error } = await supabase.from('booking_releases').insert([{
            reference: bookingRef.toUpperCase().trim(),
            customer,
            type,
            status_required: status,
            amount_requested: qty,
            amount_delivered: 0,
            active: true,
        }]);
        setLoading(false);

        if (error) {
            Alert.alert('Database Error', error.message);
        } else {
            Alert.alert('Success', `Reference ${bookingRef.toUpperCase()} created.`, [
                { text: 'OK', onPress: () => router.replace('/(admin)/booking-out') }
            ]);
        }
    };

    return (
        <View style={shared.screen}>
            <ScreenHeader
                title="CREATE RELEASE REFERENCE"
                onBack={() => router.back()}
                backLabel="◀ CANCEL"
            />
            <ScrollView contentContainerStyle={shared.formContainer}>
                <View style={styles.row}>
                    <View style={{ flex: 2 }}>
                        <FormField
                            label="BOOKING REFERENCE"
                            value={bookingRef}
                            onChangeText={setBookingRef}
                            placeholder="e.g. BK-MAEU-100"
                            autoCapitalize="characters"
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <FormField
                            label="QTY"
                            value={amount}
                            onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            maxLength={3}
                        />
                    </View>
                </View>

                <SelectorChips
                    label="REQUIRED CONDITION"
                    options={CONDITION_OPTIONS}
                    selected={status}
                    onSelect={(id) => setStatus(id as 'AV' | 'DAM')}
                    stretch
                />

                <SelectorChips
                    label="CONTAINER TYPE"
                    options={TYPE_OPTIONS}
                    selected={type}
                    onSelect={setType}
                />

                <SelectorChips
                    label="CUSTOMER / SHIPPING LINE"
                    options={CUSTOMER_OPTIONS}
                    selected={customer}
                    onSelect={setCustomer}
                />

                <ConfirmButton
                    label="CONFIRM RELEASE ORDER"
                    loadingLabel="SAVING..."
                    loading={loading}
                    color={Colors.red}
                    onPress={handleSave}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', marginBottom: 4 },
});
