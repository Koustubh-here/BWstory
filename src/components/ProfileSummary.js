import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import IconButton from './IconButton';
import colors from '../theme/colors';

export default function ProfileSummary({ profile, stats, onEdit, onStatPress }) {

  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.avatar }} style={styles.avatar} />
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile.username}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Edit profile" onPress={onEdit} style={styles.editButton}><Text style={styles.editText}>Edit</Text></Pressable>
        </View>
        <View style={styles.location}><IconButton name="map-marker" size={14} color={colors.active} style={styles.detailIcon} /><Text style={styles.detailText}>{profile.location}</Text></View>
        <View style={styles.location}><IconButton name="bag-checked" size={13} color={colors.active} style={styles.detailIcon} /><Text style={styles.detailText}>{profile.profession}</Text></View>
        <View style={styles.stats}>
          {stats.map((stat, index) => <Pressable key={stat.label} onPress={() => onStatPress(stat.label)} style={[styles.stat, index > 0 && styles.divided]} accessibilityRole="button" accessibilityLabel={`Show ${stat.label}`}><Text style={styles.statValue}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text></Pressable>)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10, backgroundColor: colors.white, minHeight: 146 },
  avatar: { width: 82, height: 82, borderRadius: 41, marginTop: 18, marginRight: 27 },
  details: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  name: { fontSize: 19, color: colors.ink, fontWeight: '400' },
  editButton: { backgroundColor: colors.navyTeal, borderRadius: 14, minWidth: 76, alignItems: 'center', paddingVertical: 5 },
  editText: { color: colors.white, fontSize: 12 },
  location: { height: 21, flexDirection: 'row', alignItems: 'center' },
  detailIcon: { width: 18, height: 18, marginRight: 0 },
  detailText: { fontSize: 12, color: colors.mutedInk },
  stats: { flexDirection: 'row', marginTop: 8 },
  stat: { flex: 1, alignItems: 'center' },
  divided: { borderLeftWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 14, color: colors.ink },
  statLabel: { fontSize: 12, color: colors.mutedInk, marginTop: 2 },
});
