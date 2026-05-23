import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import ContainerCard from '../../components/ui/ContainerCard';
import LoadingScreen from '../../components/ui/LoadingScreen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SearchBar from '../../components/ui/SearchBar';
import { Colors, shared } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

export default function InventoryScreen() {
    const [containers, setContainers] = useState<any[]>([]);
    const [search, setSearch]         = useState('');
    const [loading, setLoading]       = useState(false);
    const router = useRouter();

    useEffect(() => { fetchInventory(); }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('containers').select('id, prefix, number, location, customer, status');
            if (error) throw error;
            setContainers(data || []);
        } catch (err: any) {
            Alert.alert('Connection Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (item: any) => {
        Alert.prompt(
            `Container ${item.prefix}${item.number}`,
            `Current position: ${item.location || 'Not assigned'}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Save', onPress: (loc: any) => updateLocation(item.id, loc || '') },
            ],
            'plain-text',
            item.location || '',
        );
    };

    const updateLocation = async (id: any, loc: string) => {
        if (!loc.trim()) return;
        try {
            const { error } = await supabase.from('containers')
                .update({ location: loc.toUpperCase().trim() }).eq('id', id);
            if (error) throw error;
            fetchInventory();
        } catch (err: any) {
            Alert.alert('Update Failed', err.message);
        }
    };

    const filtered = containers.filter((c) =>
        (c.prefix + c.number).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={shared.screen}>
            <ScreenHeader
                title="YARD MOVEMENTS"
                onBack={() => router.back()}
                rightIcon="refresh"
                onRightPress={fetchInventory}
            />
            <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Search container..."
            />
            {loading ? (
                <LoadingScreen />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={{ padding: 12, gap: 8 }}
                    renderItem={({ item }) => (
                        <ContainerCard
                            prefix={item.prefix}
                            number={item.number}
                            subtitle={item.customer}
                            onPress={() => handlePress(item)}
                            right={
                                <>
                                    <Text style={styles.locLabel}>POSITION</Text>
                                    <Text style={styles.locValue}>{item.location || '---'}</Text>
                                </>
                            }
                        />
                    )}
                    ListEmptyComponent={<Text style={shared.emptyText}>No containers found.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    locLabel: { fontSize: 10, color: Colors.textLight, alignSelf: 'flex-end' },
    locValue: { fontSize: 20, fontWeight: 'bold', color: Colors.brand },
});
