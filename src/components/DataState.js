import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';

export default function DataState({ loading, error, children }) {
    if (loading) return <View style={styles.container}><Text style={styles.text}>Loading...</Text></View>;
    if (error) return <View style={styles.container}><Text style={styles.error}>{error.message}</Text></View>;
    return children;
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.softBackground },
    text: { color: colors.mutedInk },
    error: { color: colors.ink, textAlign: 'center', lineHeight: 21 },
});
