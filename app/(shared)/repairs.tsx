import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ContainerCard from '../../components/ui/ContainerCard';
import LoadingScreen from '../../components/ui/LoadingScreen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { Colors, shared } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

export default function RepairsScreen() {
    const [containers, setContainers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => { fetchContainers(); }, []);

    const fetchContainers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('containers').select('*').eq('status', 'AI');
            if (error) throw error;
            setContainers(data || []);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: 'AV' | 'DAM') => {
        const label = newStatus === 'AV' ? 'AVAILABLE' : 'DAMAGED';
        Alert.alert('Confirm Inspection', `Mark this container as ${label}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Confirm', onPress: async () => {
                    try {
                        const { error } = await supabase.from('containers').update({ status: newStatus }).eq('id', id);
                        if (error) throw error;
                        fetchContainers();
                    } catch (err: any) {
                        Alert.alert('Error', err.message);
                    }
                }
            },
        ]);
    };

    return (
        <View style={shared.screen}>
            <ScreenHeader
                title="CHECKER: INSPECTION"
                onBack={() => router.replace('/dashboard')}
                rightIcon="refresh"
                onRightPress={fetchContainers}
            />
            <Text style={styles.sectionLabel}>CONTAINERS PENDING INSPECTION (AI)</Text>
            {loading ? (
                <LoadingScreen />
            ) : (
                <FlatList
                    data={containers}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 12, gap: 10 }}
                    renderItem={({ item }) => (
                        <ContainerCard
                            prefix={item.prefix}
                            number={item.number}
                            subtitle={`Loc: ${item.location || 'N/A'} · ${item.customer}`}
                            right={
                                <>
                                    <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.green }]} onPress={() => updateStatus(item.id, 'AV')}>
                                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                        <Text style={styles.btnText}>AV</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.red }]} onPress={() => updateStatus(item.id, 'DAM')}>
                                        <Ionicons name="warning" size={16} color="#fff" />
                                        <Text style={styles.btnText}>DAM</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        />
                    )}
                    ListEmptyComponent={<Text style={shared.emptyText}>No containers pending inspection.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionLabel: { padding: 12, fontSize: 11, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 0.4 },
    btn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 6, gap: 4 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
