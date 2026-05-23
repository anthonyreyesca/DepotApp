import { Stack } from 'expo-router';

export default function KioskLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerTitle: 'KIOSK',
                headerStyle: { backgroundColor: '#000' },
                headerTintColor: '#FFD700', // Brand gold
                headerTitleAlign: 'center',
            }}
        />
    );
}
