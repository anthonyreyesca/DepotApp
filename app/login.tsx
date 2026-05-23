import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ConfirmButton from '../components/ui/ConfirmButton';
import FormField from '../components/ui/FormField';
import { supabase } from '../lib/supabase';

export default function Login() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const router = useRouter();

    async function signIn() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            Alert.alert('Login Failed', error.message);
            setLoading(false);
        } else {
            router.replace('/dashboard');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>LOGISTICS TERMINAL</Text>
                <FormField
                    label=""
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                />
                <FormField
                    label=""
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                />
                <ConfirmButton
                    label="SIGN IN"
                    loadingLabel="SIGNING IN..."
                    loading={loading}
                    color="#333"
                    onPress={signIn}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#333', justifyContent: 'center', padding: 20 },
    card:      { backgroundColor: '#FFF', padding: 30, borderRadius: 10 },
    title:     { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input:     { backgroundColor: '#F5F5F5', height: 50, borderColor: '#DDD', fontSize: 15 },
});
