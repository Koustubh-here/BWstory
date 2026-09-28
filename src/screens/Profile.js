import React from 'react';
import { Alert, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';
import FollowerRow from '../components/FollowerRow';
import IconButton from '../components/IconButton';
import ProfileSummary from '../components/ProfileSummary';
import RemoveFollowerModal from '../components/RemoveFollowerModal';
import DataState from '../components/DataState';
import { useAuth } from '../context/AuthContext';
import useProfileData from '../hooks/useProfileData';
import useProfileFollowers from '../hooks/useProfileFollowers';
import colors from '../theme/colors';

export default function Profile({ navigation }) {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { profile, posts, loading: profileLoading, error: profileError, reload: reloadProfile } = useProfileData(user?.id);
  const { tab, setTab, query, setQuery, visibleFollowers, followersCount, followingCount, loading: followersLoading, error: followersError, toggleFollowing, removeFollower, reload: reloadFollowers } = useProfileFollowers(user?.id);
  const [listVisible, setListVisible] = React.useState(false);
  const [selectedFollower, setSelectedFollower] = React.useState(null);

  useFocusEffect(React.useCallback(() => {
    if (!user?.id) return undefined;
    reloadProfile();
    reloadFollowers();
    return undefined;
  }, [reloadFollowers, reloadProfile, user?.id]));

  const showList = label => {
    if (label === 'Feed') return;
    setTab(label);
    setQuery('');
    setListVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconButton name="menu" size={24} color={colors.white} onPress={() => Alert.alert('Menu', 'More options are coming soon.')} accessibilityLabel="Open menu" />
        <View style={styles.searchBox}>
          <TextInput
            accessibilityLabel="Search followers"
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor="#8f9ba1"
            style={styles.searchInput}
          />
          <IconButton name="magnify" size={19} color="#264554" style={styles.searchIcon} />
        </View>
        <IconButton name="tune-variant" size={22} color={colors.white} onPress={() => Alert.alert('Filters', 'Follower filters are coming soon.')} accessibilityLabel="Open filters" />
      </View>

      <DataState loading={authLoading || profileLoading} error={authError || profileError}>
        {profile ? <>
          <ProfileSummary profile={profile} stats={[{ value: String(posts.length), label: 'Feed' }, { value: String(followersCount), label: 'Followers' }, { value: String(followingCount), label: 'Following' }]} onEdit={() => navigation.navigate('EditProfile', { profile })} onStatPress={showList} />
          <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Posts</Text>
            <View style={styles.postGrid}>
              {posts.map(post => <Pressable key={post.id} style={styles.post} accessibilityRole="imagebutton"><Image source={{ uri: post.thumbnail_url }} style={styles.postImage} /><View style={styles.postOverlay}><Text style={styles.postViews}>{post.view_count} views</Text></View></Pressable>)}
            </View>
          </ScrollView>
        </> : null}
      </DataState>

      <BottomNavigation navigation={navigation} active="Profile" />
      <Modal visible={listVisible} transparent animationType="slide" hardwareAccelerated onRequestClose={() => setListVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.followersPanel}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>{tab}</Text><IconButton name="close" size={22} color={colors.ink} onPress={() => setListVisible(false)} accessibilityLabel="Close list" /></View>
            <View style={styles.listSearch}>
              <IconButton name="magnify" size={22} color={colors.dimText} style={styles.listSearchIcon} />
              <TextInput accessibilityLabel={`Filter ${tab.toLowerCase()}`} value={query} onChangeText={setQuery} placeholder="Search" placeholderTextColor={colors.dimText} style={styles.listSearchInput} />
            </View>
            <DataState loading={followersLoading} error={followersError}>
              <FlatList data={visibleFollowers} keyExtractor={person => person.id} renderItem={({ item }) => <FollowerRow person={item} showRemove={tab === 'Followers'} onRemove={() => setSelectedFollower(item)} onToggle={() => toggleFollowing(item)} />} showsVerticalScrollIndicator={false} ListEmptyComponent={<Text style={styles.emptyText}>No {tab.toLowerCase()} found</Text>} contentContainerStyle={styles.listContent} />
            </DataState>
          </View>
        </View>
      </Modal>
      <RemoveFollowerModal person={selectedFollower} onCancel={() => setSelectedFollower(null)} onRemove={async () => { await removeFollower(selectedFollower); setSelectedFollower(null); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.navyTeal },
  header: { height: 66, backgroundColor: colors.navyTeal, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  searchBox: { height: 38, width: '68%', backgroundColor: colors.lightText, borderRadius: 9, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  searchInput: { flex: 1, padding: 0, color: '#193b48', fontSize: 12 },
  searchIcon: { width: 24, height: 30 },
  feed: { backgroundColor: colors.softBackground },
  feedContent: { padding: 18, paddingBottom: 26 },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '600', marginBottom: 12 },
  postGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  post: { width: '32%', aspectRatio: 1, marginBottom: 6, backgroundColor: colors.border, position: 'relative' },
  postImage: { width: '100%', height: '100%' },
  postOverlay: { position: 'absolute', left: 6, right: 6, bottom: 5 },
  postViews: { color: colors.white, fontSize: 10, textShadowColor: '#000', textShadowRadius: 3 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  followersPanel: { height: '72%', backgroundColor: colors.white, borderTopLeftRadius: 27, borderTopRightRadius: 27, paddingTop: 10, overflow: 'hidden' },
  sheetHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 5 },
  sheetHeader: { height: 49, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22 },
  sheetTitle: { color: colors.ink, fontSize: 18, fontWeight: '600' },
  listSearch: { height: 48, marginHorizontal: 26, marginTop: 8, marginBottom: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11 },
  listSearchIcon: { width: 27, height: 30 },
  listSearchInput: { flex: 1, color: colors.ink, fontSize: 13, padding: 0 },
  listContent: { paddingBottom: 8 },
  emptyText: { textAlign: 'center', color: colors.mutedInk, padding: 24 },
});
