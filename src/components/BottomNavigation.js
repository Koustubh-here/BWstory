import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import IconButton from './IconButton';
import colors from '../theme/colors';

export default function BottomNavigation({ navigation, active = 'Discover' }) {
  const goTo = screen => navigation.navigate(screen);
  const unavailable = label => Alert.alert(label, `${label} is coming soon.`);
  return (
    <View style={styles.container}>
      <IconButton name="compass-outline" size={24} color={active === 'Discover' ? colors.active : colors.inactive} onPress={() => goTo('Discover')} />
      <IconButton name="map-marker-outline" size={24} color={colors.inactive} onPress={() => unavailable('Map')} accessibilityLabel="Open map" />
      <IconButton name="plus-circle-outline" size={25} color={colors.inactive} onPress={() => unavailable('Create story')} accessibilityLabel="Create story" />
      <IconButton name="bell-outline" size={24} color={colors.inactive} onPress={() => unavailable('Notifications')} accessibilityLabel="Open notifications" />
      <IconButton
        name="account-circle-outline"
        size={27}
        color={active === 'Profile' ? colors.active : colors.inactive}
        onPress={() => goTo('Profile')}
        accessibilityLabel="Open profile"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 56, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
});
