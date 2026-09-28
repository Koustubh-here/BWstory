import React from 'react';
import {Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

export default function RemoveFollowerModal({person, onCancel, onRemove}) {
  return (
    <Modal visible={Boolean(person)} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <View style={styles.titleRow}>
            {person ? <Image source={{uri: person.avatar}} style={styles.avatar} /> : null}
            <Text style={styles.title}>Remove Follower?</Text>
          </View>
          <Text style={styles.message}>We won't tell {person?.name ?? 'this person'} they were removed from your followers</Text>
          <View style={styles.actions}>
            <Pressable onPress={onRemove} style={styles.action}><Text style={styles.remove}>Remove</Text></Pressable>
            <Pressable onPress={onCancel} style={[styles.action, styles.cancelAction]}><Text style={styles.cancel}>Cancel</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', paddingHorizontal: 66},
  dialog: {backgroundColor: colors.white, borderRadius: 18, overflow: 'hidden', elevation: 8},
  titleRow: {height: 78, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18},
  avatar: {width: 50, height: 50, borderRadius: 25, marginRight: 18},
  title: {fontSize: 17, color: '#20282d'},
  message: {fontSize: 14, lineHeight: 21, color: colors.dimText, textAlign: 'center', paddingHorizontal: 18, paddingBottom: 18},
  actions: {height: 51, flexDirection: 'row', borderTopWidth: 1, borderColor: colors.border},
  action: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  cancelAction: {borderLeftWidth: 1, borderColor: colors.border},
  remove: {fontSize: 16, color: '#9ba7ab'},
  cancel: {fontSize: 16, fontWeight: '600', color: colors.ink},
});
