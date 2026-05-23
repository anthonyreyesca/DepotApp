import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraCapture from '../../components/ui/CameraCapture';
import ContainerCard from '../../components/ui/ContainerCard';
import LoadingScreen from '../../components/ui/LoadingScreen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { Colors, shared } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

export default function RepairsScreen() {
    const [containers, setContainers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const locationRef = React.useRef<{ lat: number; lng: number } | null>(null);
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

    const handleSelectContainer = (id: string) => {
        if (selectedId === id) { setSelectedId(null); setCapturedPhotoUrl(null); setLocation(null); return; }
        setSelectedId(id);
        setCapturedPhotoUrl(null);
        setLocation(null);
    };

    const captureLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location access is required to log the inspection site.');
            return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        locationRef.current = coords;
        setLocation(coords);
    };

    const handlePhotoCaptured = async (url: string) => {
        setCapturedPhotoUrl(url);
        await captureLocation();
    };

    const updateStatus = async (id: string, newStatus: 'AV' | 'DAM') => {
        if (!capturedPhotoUrl) {
            Alert.alert('Photo Required', 'Please take an inspection photo before marking the status.');
            return;
        }
        const label = newStatus === 'AV' ? 'AVAILABLE' : 'DAMAGED';
        Alert.alert('Confirm Inspection', `Mark this container as ${label}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Confirm', onPress: async () => {
                    try {
                        const { error } = await supabase.from('containers').update({
                            status: newStatus,
                            inspection_photo_url: capturedPhotoUrl,
                            inspection_lat: locationRef.current?.lat ?? null,
                            inspection_lng: locationRef.current?.lng ?? null,
                        }).eq('id', id);
                        if (error) throw error;
                        setSelectedId(null);
                        setCapturedPhotoUrl(null);
                        setLocation(null);
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
                    renderItem={({ item }) => {
                        const isSelected = selectedId === item.id.toString();
                        return (
                            <View>
                                <ContainerCard
                                    prefix={item.prefix}
                                    number={item.number}
                                    subtitle={`Loc: ${item.location || 'N/A'} · ${item.customer}`}
                                    onPress={() => handleSelectContainer(item.id.toString())}
                                    right={
                                        isSelected && capturedPhotoUrl ? (
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
                                        ) : null
                                    }
                                />
                                {isSelected && (
                                    <View style={styles.photoPane}>
                                        <CameraCapture
                                            containerId={item.id.toString()}
                                            onPhotoCaptured={handlePhotoCaptured}
                                        />
                                        {capturedPhotoUrl && location && (
                                            <View style={styles.locationBadge}>
                                                <Ionicons name="location" size={13} color={Colors.green} />
                                                <Text style={styles.locationText}>
                                                    {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                                                </Text>
                                            </View>
                                        )}
                                        {capturedPhotoUrl && !location && (
                                            <View style={styles.locationBadge}>
                                                <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                                                <Text style={[styles.locationText, { color: Colors.textMuted }]}>
                                                    Location not available
                                                </Text>
                                            </View>
                                        )}
                                        {!capturedPhotoUrl && (
                                            <Text style={styles.photoHint}>
                                                Take a photo to unlock AV / DAM buttons
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        );
                    }}
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
    photoPane: { backgroundColor: '#F7F7F7', padding: 12, borderWidth: 0.5, borderColor: '#DDD', borderTopWidth: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
    photoHint: { textAlign: 'center', color: Colors.textMuted, fontSize: 12, marginTop: 8 },
    locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
    locationText: { fontSize: 11, color: Colors.green, fontWeight: 'bold' },
});
