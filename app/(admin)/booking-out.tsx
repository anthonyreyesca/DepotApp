import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import BookingOutRow from '../../components/ui/BookingOutRow';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SearchBar from '../../components/ui/SearchBar';
import TableHeader from '../../components/ui/TableHeader';
import { shared } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

const COLS = [
    { label: 'OUT REFERENCE', width: '25%' },
    { label: 'TYPE', width: '14%' },
    { label: 'STATUS', width: '14%' },
    { label: 'CUSTOMER', width: '25%' },
    { label: 'DEL/REQ', width: '22%', last: true },
] as const;

const COL_WIDTHS = COLS.map((c) => c.width);

interface DeliveryDetail {
    delivered_at: string;
    container_id: number | null;
    containers: { prefix: string; number: string; type: string } | null;
}

export default function BookingOutList() {
    const [references, setReferences] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [shippedContainers, setShippedContainers] = useState<DeliveryDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => { fetchReferences(); }, []);

    const fetchReferences = async () => {
        setLoading(true);
        let query = supabase.from('booking_releases').select('*')
            .order('active', { ascending: false })
            .order('created_at', { ascending: false });
        if (searchQuery.trim()) query = query.ilike('reference', `%${searchQuery.toUpperCase()}%`);
        const { data, error } = await query;
        setLoading(false);
        if (error) Alert.alert('Error', error.message);
        else setReferences(data || []);
    };

    const handleSelectRow = async (bookingId: number) => {
        if (selectedId === bookingId) { setSelectedId(null); setShippedContainers([]); return; }
        setSelectedId(bookingId);
        setLoadingDetails(true);
        const { data, error } = await supabase
            .from('booking_deliveries')
            .select('delivered_at, container_id, containers(prefix, number, type)')
            .eq('booking_id', bookingId);
        if (!error && data) setShippedContainers(data as unknown as DeliveryDetail[]);
        setLoadingDetails(false);
    };

    return (
        <View style={shared.screen}>
            <ScreenHeader
                title="BOOKING OUT MANAGEMENT"
                onBack={() => router.replace('/dashboard')}
            />
            <SearchBar
                label="Booking OUT"
                value={searchQuery}
                onChangeText={(t) => setSearchQuery(t.toUpperCase())}
                placeholder="Reference..."
                actions={[
                    { label: 'SEARCH', style: 'blue', onPress: fetchReferences },
                    { label: 'ADD', style: 'green', onPress: () => router.push('/create-booking-out') },
                ]}
            />
            <TableHeader columns={COLS as any} />
            <FlatList
                data={references}
                keyExtractor={(item) => item.id.toString()}
                onRefresh={fetchReferences}
                refreshing={loading}
                renderItem={({ item }) => (
                    <BookingOutRow
                        item={item}
                        colWidths={COL_WIDTHS}
                        isSelected={selectedId === item.id}
                        shippedContainers={selectedId === item.id ? shippedContainers : []}
                        loadingDetails={loadingDetails}
                        onPress={() => handleSelectRow(item.id)}
                    />
                )}
            />
        </View>
    );
}
