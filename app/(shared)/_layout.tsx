import { Stack } from 'expo-router';

export default function SharedLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerTitle: 'GENERAL',
                headerStyle: { backgroundColor: '#607D8B' }, // Blue-grey
                headerTintColor: '#FFF',
            }}
        />
    );
}
