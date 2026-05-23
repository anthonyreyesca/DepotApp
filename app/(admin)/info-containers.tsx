import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SearchBar from '../../components/ui/SearchBar';
import StatusBadge from '../../components/ui/StatusBadge';
import TableHeader from '../../components/ui/TableHeader';
import { shared } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

const COLS = [
    { label: 'PRE',    width: '14%' },
    { label: 'NUMBER', width: '26%' },
    { label: 'TYPE',   width: '12%' },
    { label: 'ST',     width: '14%' },
    { label: 'CUST',   width: '14%' },
    { label: 'LOC',    width: '20%', last: true },
] as const;

export default function InfoContainers() {
    const [containers, setContainers] = useState<any[]>([]);
    const [search, setSearch]         = useState('');
    const [loading, setLoading]       = useState(false);
    const router = useRouter();

    useEffect(() => { fetchContainers(); }, []);

    const fetchContainers = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('containers').select('*').order('number', { ascending: true });
        if (!error && data) setContainers(data);
        setLoading(false);
    };

    const filtered = containers.filter((c) =>
        `${c.prefix}${c.number}`.replace(/\s+/g, '').toLowerCase()
            .includes(search.replace(/\s+/g, '').toLowerCase())
    );

    return (
        <View style={shared.screen}>
            <ScreenHeader
                title="CONTAINER INVENTORY INFO"
                onBack={() => router.replace('/dashboard')}
            />
            <SearchBar
                label="Container Nr:"
                value={search}
                onChangeText={setSearch}
                placeholder="MSCU 1234567"
                actions={[{ label: 'SEARCH', style: 'blue', onPress: fetchContainers }]}
            />
            <TableHeader columns={COLS as any} />
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchContainers} />}
                renderItem={({ item, index }) => (
                    <View style={[shared.tableRow, index % 2 === 1 && shared.tableRowAlt]}>
                        <View style={[shared.td, { width: COLS[0].width }]}><Text style={shared.tdText}>{item.prefix}</Text></View>
                        <View style={[shared.td, { width: COLS[1].width }]}><Text style={shared.tdTextBold}>{item.number}</Text></View>
                        <View style={[shared.td, { width: COLS[2].width }]}><Text style={shared.tdText}>{item.type}</Text></View>
                        <View style={[shared.td, { width: COLS[3].width }]}><StatusBadge status={item.status} /></View>
                        <View style={[shared.td, { width: COLS[4].width }]}><Text style={shared.tdText} numberOfLines={1}>{item.customer}</Text></View>
                        <View style={[shared.td, { width: COLS[5].width, borderRightWidth: 0 }]}>
                            <Text style={item.location ? shared.locationText : shared.tdText}>{item.location || '---'}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={shared.emptyText}>{loading ? 'Loading...' : 'No containers in yard.'}</Text>
                }
            />
        </View>
    );
}
