import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
import colors from '../../theme/colors';

export default function VideoCard({ post }) {
  const [isFollowing, setIsFollowing] = useState(post.is_following);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const controlsTimer = useRef(null);

  useEffect(() => () => clearTimeout(controlsTimer.current), []);

  const showControls = () => {
    setControlsVisible(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setControlsVisible(false), 1800);
  };

  return (
    <View style={styles.card}>
      <View style={styles.authorRow}>
        <Image source={{ uri: post.author_avatar_url }} style={styles.avatar} />
        <Text style={styles.authorName}>{post.author_name}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setIsFollowing(!isFollowing)}
          style={[styles.followButton, isFollowing && styles.followingButton]}>
          <Text style={styles.followText}>{isFollowing ? 'Following' : 'Follow'}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.videoFrame} onPress={showControls} accessibilityRole="button" accessibilityLabel="Show video controls">
        <Image source={{ uri: post.thumbnail_url }} style={styles.thumbnail} />
        <View style={styles.videoShade} />
        {controlsVisible ? <>
          <IconButton name="dots-vertical" size={23} color={colors.white} style={styles.moreButton} />
          <View style={styles.playControls}>
            <IconButton name="rewind-10" size={29} color={colors.white} />
            <IconButton name={isPlaying ? 'pause' : 'play'} size={38} color={colors.white} onPress={() => setIsPlaying(!isPlaying)} style={styles.playButton} />
            <IconButton name="fast-forward-10" size={29} color={colors.white} />
          </View>
          <IconButton name="volume-high" size={18} color={colors.white} style={styles.volumeButton} />
          <View style={styles.videoFooter}>
            <Text style={styles.timestamp}>0:15/{post.duration}</Text>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${post.progress * 100}%` }]} /></View>
          </View>
        </> : null}
      </Pressable>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{post.date}</Text>
        <Text style={styles.metaText}>{post.location} | {post.view_count} Views</Text>
      </View>
      <Text style={styles.headline} numberOfLines={2}>
        {post.headline} <Text style={styles.moreText}>more</Text>
      </Text>
      <View style={styles.engagementRow}>
        <IconButton
          name={isLiked ? 'heart' : 'heart-outline'}
          size={22}
          color={isLiked ? colors.active : '#31434d'}
          onPress={() => setIsLiked(!isLiked)}
        />
        <IconButton name="share-variant-outline" size={21} color="#31434d" />
        <IconButton name="comment-outline" size={22} color="#31434d" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 5, marginBottom: 18, paddingBottom: 7, shadowColor: '#173b46', shadowOpacity: 0.12, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 3, overflow: 'hidden' },
  authorRow: { height: 42, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  avatar: { width: 25, height: 25, borderRadius: 13, marginRight: 8 },
  authorName: { fontSize: 11, color: '#35424a', fontWeight: '600', flex: 1 },
  followButton: { borderWidth: 1, borderColor: '#69818a', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 4 },
  followingButton: { backgroundColor: '#edf3f3', borderColor: '#a5b6ba' },
  followText: { fontSize: 10, color: '#405b64' },
  videoFrame: { height: 170, backgroundColor: '#17242a', position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  videoShade: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)' },
  moreButton: { position: 'absolute', right: 5, top: 4 },
  playControls: { position: 'absolute', left: 0, right: 0, top: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 13 },
  playButton: { marginHorizontal: 3 },
  volumeButton: { position: 'absolute', left: 9, bottom: 19, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 15 },
  videoFooter: { position: 'absolute', left: 10, right: 10, bottom: 5 },
  timestamp: { fontSize: 8, color: colors.white, marginBottom: 3 },
  progressTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  progressFill: { height: 2, backgroundColor: colors.progress },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 9 },
  metaText: { fontSize: 9, color: colors.mutedInk },
  headline: { fontSize: 11, lineHeight: 17, color: '#556269', paddingHorizontal: 12, paddingTop: 7 },
  moreText: { color: '#637a81' },
  engagementRow: { flexDirection: 'row', paddingHorizontal: 4, paddingTop: 3, justifyContent: 'flex-start', gap: 9 },
});
