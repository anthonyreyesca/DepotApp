import { Stack } from 'expo-router';

export default function OperatorLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerTitle: 'OPERATOR',
                headerStyle: { backgroundColor: '#2196F3' }, // Blue
                headerTintColor: '#FFF',
            }}
        />
    );
}
