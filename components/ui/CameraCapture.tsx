import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

interface CameraCaptureProps {
    containerId: string;
    onPhotoCaptured: (url: string) => void;
}

export default function CameraCapture({ containerId, onPhotoCaptured }: CameraCaptureProps) {
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is required to take inspection photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.3,
            allowsEditing: false,
            base64: true,
        });

        if (result.canceled) return;

        const asset = result.assets[0];
        setPhotoUri(asset.uri);
        await uploadPhoto(asset.uri, asset.base64!);
    };

    const uploadPhoto = async (uri: string, base64: string) => {
        setUploading(true);
        try {
            const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `${containerId}_${Date.now()}.${ext}`;
            const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

            // base64 comes directly from ImagePicker — no FileSystem needed
            const { error } = await supabase.storage
                .from('inspection-photos')
                .upload(fileName, decode(base64), {
                    contentType: mimeType,
                    upsert: false,
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from('inspection-photos')
                .getPublicUrl(fileName);

            onPhotoCaptured(data.publicUrl);
        } catch (err: any) {
            Alert.alert('Upload Failed', err.message);
            setPhotoUri(null);
        } finally {
            setUploading(false);
        }
    };

    // Decode base64 string to Uint8Array for Supabase upload
    const decode = (base64: string): Uint8Array => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
    };

    return (
        <View style={styles.wrapper}>
            {photoUri ? (
                <View style={styles.preview}>
                    <Image source={{ uri: photoUri }} style={styles.image} />
                    <TouchableOpacity style={styles.retakeBtn} onPress={takePhoto} disabled={uploading}>
                        <Text style={styles.retakeBtnText}>{uploading ? 'UPLOADING...' : 'RETAKE PHOTO'}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto} disabled={uploading}>
                    <Text style={styles.cameraIcon}>📷</Text>
                    <Text style={styles.cameraBtnText}>
                        {uploading ? 'UPLOADING...' : 'TAKE INSPECTION PHOTO'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: 16 },
    cameraBtn: { backgroundColor: '#222', padding: 20, borderRadius: 8, alignItems: 'center', gap: 8 },
    cameraIcon: { fontSize: 32 },
    cameraBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.4 },
    preview: { alignItems: 'center', gap: 10 },
    image: { width: '100%', height: 220, borderRadius: 8, resizeMode: 'cover' },
    retakeBtn: { backgroundColor: '#555', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6 },
    retakeBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
});
