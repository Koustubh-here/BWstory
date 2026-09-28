import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../theme/colors';

export default function LandingScreen({ navigation }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.86)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, friction: 7, useNativeDriver: true }),
        ]).start();

        const timer = setTimeout(() => navigation.replace('Discover'), 1300);
        return () => clearTimeout(timer);
    }, [navigation, opacity, scale]);

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Animated.View style={{ opacity, transform: [{ scale }] }}>
                <View style={styles.iconFrame}>
                    <MaterialCommunityIcons name="newspaper-variant-outline" size={76} color={colors.white} style={styles.fallbackIcon} />
                    <Image source={require('../assets/App-icon.png')} style={styles.icon} resizeMode="contain" accessibilityLabel="BWstory app icon" />
                </View>
            </Animated.View>
            <Text style={styles.title}>BWstory</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navyTeal },
    iconFrame: { width: 132, height: 132, borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navyTeal, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
    fallbackIcon: { position: 'absolute' },
    icon: { width: 132, height: 132, borderRadius: 30 },
    title: { marginTop: 22, color: colors.white, fontSize: 25, fontWeight: '700', letterSpacing: 0.5 },

})