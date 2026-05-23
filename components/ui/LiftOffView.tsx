import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ConfirmButton from './ConfirmButton';
import ScreenHeader from './ScreenHeader';
import { Colors, shared } from '../../constants/theme';

interface LiftOffViewProps {
    containerRef: string;
    onBack: () => void;
    onConfirm: (location: string) => void;
}

export default function LiftOffView({ containerRef, onBack, onConfirm }: LiftOffViewProps) {
    const [location, setLocation] = React.useState('');

    const handleConfirm = () => {
        if (!location) return;
        onConfirm(location.toUpperCase());
    };

    return (
        <View style={shared.screen}>
            <ScreenHeader title="LIFT OFF — ASSIGN POSITION" onBack={onBack} />
            <View style={styles.box}>
                <Text style={styles.label}>POSITION FOR: {containerRef}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="POSITION (e.g. A-12)"
                    placeholderTextColor={Colors.placeholder}
                    onChangeText={setLocation}
                    autoCapitalize="characters"
                />
                <ConfirmButton
                    label="CONFIRM LIFT OFF"
                    color={Colors.green}
                    onPress={handleConfirm}
                    style={{ width: '100%' }}
                />
                <TouchableOpacity onPress={onBack} style={{ marginTop: 20 }}>
                    <Text style={{ color: Colors.red, fontWeight: 'bold' }}>CANCEL</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    box:   { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    label: { fontWeight: 'bold', fontSize: 14, color: Colors.text, marginBottom: 16, textAlign: 'center' },
    input: { width: '100%', padding: 16, backgroundColor: '#EEE', borderRadius: 5, marginBottom: 20, fontSize: 22, textAlign: 'center', fontWeight: 'bold' },
});
