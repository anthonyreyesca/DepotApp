import { Stack } from 'expo-router';

export default function AdminLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerTitle: 'ADMIN',
                headerStyle: { backgroundColor: '#333' },
                headerTintColor: '#FFF',
                headerBackTitle: 'Back',
                gestureEnabled: false,
            }}
        />
    );
}
