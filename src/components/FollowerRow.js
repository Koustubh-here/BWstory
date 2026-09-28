
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';

export default function FollowerRow({ person, onToggle, showRemove, onRemove }) {
  const isFollowing = person.isFollowing;

  return (
    <View style={styles.row}>
      <Image source={{ uri: person.avatar }} style={styles.avatar} />
      <View style={styles.details}><Text style={styles.name}>{person.name}</Text><Text style={styles.number}>{person.number}</Text></View>
      {showRemove ? <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${person.name}`} onPress={onRemove} style={styles.button}><Text style={styles.buttonText}>Remove</Text></Pressable> : <Pressable accessibilityRole="button" accessibilityLabel={isFollowing ? `Unfollow ${person.name}` : `Follow ${person.name}`} onPress={onToggle} style={[styles.button, isFollowing && styles.followingButton]}><Text style={[styles.buttonText, isFollowing && styles.followingText]}>{isFollowing ? 'Following' : 'Follow'}</Text></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { height: 74, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 26 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 13 },
  details: { flex: 1 },
  name: { fontSize: 14, color: colors.ink },
  number: { fontSize: 12, color: colors.mutedInk, marginTop: 3 },
  button: { minWidth: 82, height: 29, borderWidth: 1, borderColor: colors.active, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  followingButton: { backgroundColor: colors.active },
  buttonText: { fontSize: 12, color: colors.active },
  followingText: { color: colors.white },
});
