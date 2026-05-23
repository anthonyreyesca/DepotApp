import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DashboardCard from '../components/ui/DashboardCard';
import LoadingScreen from '../components/ui/LoadingScreen';
import LogoutButton from '../components/ui/LogoutButton';
import { Colors, shared } from '../constants/theme';
import { supabase } from '../lib/supabase';

const ALL_MENU_ITEMS = [
    { name: 'SELF-SERVICE DESK', path: '/(kiosk)/main',           icon: 'desktop-outline',     color: Colors.brand,  allowed: ['admin', 'kiosk'] },
    { name: 'INFO CONTAINERS',   path: '/(admin)/info-containers', icon: 'cube-outline',         color: Colors.brand,  allowed: ['admin'] },
    { name: 'BOOKING IN',        path: '/(admin)/booking-in',      icon: 'log-in-outline',       color: Colors.green,  allowed: ['admin'] },
    { name: 'BOOKING OUT',       path: '/(admin)/booking-out',     icon: 'log-out-outline',      color: Colors.red,    allowed: ['admin'] },
    { name: 'INVENTORY',         path: '/(operator)/inventory',    icon: 'list-outline',         color: Colors.brand,  allowed: ['operator', 'admin'] },
    { name: 'ORDERS',            path: '/(shared)/orders',         icon: 'reorder-four-outline', color: Colors.orange, allowed: ['admin', 'operator'] },
    { name: 'REPAIRS',           path: '/(shared)/repairs',        icon: 'build-outline',        color: Colors.brown,  allowed: ['admin', 'checker'] },
] as const;

export default function Dashboard() {
    const router = useRouter();
    const [role, setRole]       = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadProfile(); }, []);

    async function loadProfile() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.replace('/login'); return; }
            const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            const userRole = data?.role || 'operator';
            setRole(userRole);
            if (userRole === 'kiosk') router.replace('/(kiosk)/main');
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => { await supabase.auth.signOut(); router.replace('/login'); };

    if (loading) return <LoadingScreen fullscreen />;

    const menuItems = ALL_MENU_ITEMS.filter((item) => role && item.allowed.includes(role as any));

    return (
        <View style={shared.screen}>
            <View style={shared.headerDashboard}>
                <View style={{ flex: 1 }}>
                    <Text style={shared.headerTitle}>LOGISTICS TERMINAL</Text>
                    <Text style={shared.headerBadge}>{role?.toUpperCase() || 'USER'}</Text>
                </View>
                <LogoutButton onConfirm={handleLogout} />
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {menuItems.map((item, i) => (
                    <DashboardCard
                        key={i}
                        name={item.name}
                        icon={item.icon as any}
                        color={item.color}
                        onPress={() => router.push(item.path as any)}
                    />
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Terminal Management System v1.1</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    grid:       { padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
    footer:     { padding: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#DDD' },
    footerText: { fontSize: 10, color: Colors.textLight },
});
