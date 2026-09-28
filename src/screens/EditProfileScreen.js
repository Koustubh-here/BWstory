import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import BottomNavigation from '../components/BottomNavigation';
import IconButton from '../components/IconButton';
import colors from '../theme/colors';
import { updateProfile, uploadAvatar } from '../lib/supabaseData';

const fields = [
    ['username', 'Name'],
    ['gender', 'Gender'],
    ['location', 'Location'],
    ['profession', 'Profession'],
    ['bio', 'Bio'],
];

export default function EditProfileScreen({ navigation, route }) {
    const [profile, setProfile] = useState(route.params.profile);
    const update = (key, value) => setProfile(current => ({ ...current, [key]: value }));

    const choosePhoto = () => launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, async response => {
        const uri = response.assets?.[0]?.uri;
        if (!uri) return;
        try {
            const avatarUrl = await uploadAvatar(profile.id, uri);
            update('avatar', avatarUrl);
            update('avatar_url', avatarUrl);
        } catch (error) {
            Alert.alert('Photo upload failed', error.message);
        }
    });

    const save = async () => {
        try {
            await updateProfile(profile.id, profile);
            navigation.goBack();
        } catch (error) {
            Alert.alert('Could not save profile', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}><IconButton name="chevron-left" size={28} color={colors.white} onPress={() => navigation.goBack()} accessibilityLabel="Go back" /><Text style={styles.headerTitle}>Edit Profile</Text><Pressable onPress={save} accessibilityRole="button"><Text style={styles.save}>Save</Text></Pressable></View>
            <ScrollView style={styles.form} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Pressable onPress={choosePhoto} style={styles.photoButton} accessibilityRole="button" accessibilityLabel="Change profile picture"><Image source={{ uri: profile.avatar }} style={styles.photo} /><View style={styles.camera}><IconButton name="camera-outline" size={22} color={colors.navyTeal} /></View></Pressable>
                {fields.map(([key, label]) => <View key={key} style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={profile[key]} onChangeText={value => update(key, value)} multiline={key === 'bio'} textAlignVertical={key === 'bio' ? 'top' : 'center'} style={[styles.input, key === 'bio' && styles.bio]} /></View>)}
            </ScrollView>
            <BottomNavigation navigation={navigation} active="Profile" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.navyTeal },
    header: { height: 66, backgroundColor: colors.navyTeal, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 },
    headerTitle: { color: colors.white, fontSize: 16, letterSpacing: 0.3 },
    save: { color: colors.white, fontSize: 14, paddingHorizontal: 8 },
    form: { backgroundColor: colors.softBackground },
    content: { padding: 20, paddingBottom: 30 },
    photoButton: { alignSelf: 'center', marginBottom: 20, position: 'relative' },
    photo: { width: 132, height: 132, borderRadius: 66 },
    camera: { position: 'absolute', right: -4, bottom: 0, width: 43, height: 43, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', elevation: 3 },
    field: { marginBottom: 19 },
    label: { color: colors.mutedInk, fontSize: 13, marginBottom: 8, letterSpacing: 0.5 },
    input: { height: 42, backgroundColor: '#e9edef', borderRadius: 6, color: colors.ink, fontSize: 14, paddingHorizontal: 17 },
    bio: { height: 116, paddingTop: 13, lineHeight: 22 },
});