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

export default function BookingIn() {
    const router = useRouter();
    const [prefix, setPrefix] = useState('');
    const [number, setNumber] = useState('');
    const [type, setType] = useState<string>(CONTAINER_TYPES[0]);
    const [customer, setCustomer] = useState<string>(CUSTOMERS[0].id);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (prefix.length < 4 || number.length < 7) {
            Alert.alert('Incomplete Data', 'Prefix must be 4 letters and Number must be 7 digits.');
            return;
        }
        setLoading(true);
        const { data: existing } = await supabase.from('containers')
            .select('id').eq('prefix', prefix.toUpperCase()).eq('number', number).maybeSingle();
        if (existing) {
            Alert.alert('Already Registered', `Container ${prefix.toUpperCase()}${number} is already in the system.`);
            setLoading(false);
            return;
        }
        const { error } = await supabase.from('containers').insert([{
            prefix: prefix.toUpperCase(),
            number,
            type,
            customer,
            status: 'EXP',
            location: null,
        }]);
        setLoading(false);
        if (error) {
            Alert.alert('Database Error', error.message);
        } else {
            Alert.alert('Success', `Booking ${prefix}${number} registered.`, [
                { text: 'OK', onPress: () => router.replace('/dashboard') }
            ]);
        }
    };

    return (
        <View style={shared.screen}>
            <ScreenHeader
                title="NEW BOOKING IN"
                onBack={() => router.replace('/dashboard')}
            />
            <ScrollView contentContainerStyle={shared.formContainer}>
                <View style={styles.row}>
                    <View style={styles.half}>
                        <FormField
                            label="PREFIX"
                            value={prefix}
                            onChangeText={(t) => setPrefix(t.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                            placeholder="MSCU"
                            maxLength={4}
                        />
                    </View>
                    <View style={styles.half}>
                        <FormField
                            label="NUMBER"
                            value={number}
                            onChangeText={(t) => setNumber(t.replace(/[^0-9]/g, ''))}
                            placeholder="1234567"
                            keyboardType="numeric"
                            maxLength={7}
                        />
                    </View>
                </View>

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
                    label="CONFIRM BOOKING"
                    loadingLabel="PROCESSING..."
                    loading={loading}
                    color={Colors.green}
                    onPress={handleSave}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 12, marginBottom: 4 },
    half: { flex: 1 },
});
