import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from '../../components/BottomNavigation';
import IconButton from '../../components/IconButton';
import useDiscoverPosts from '../../hooks/useDiscoverPosts';
import colors from '../../theme/colors';
import VideoCard from './VideoCard';
import DataState from '../../components/DataState';
import { useAuth } from '../../context/AuthContext';

export default function DiscoverScreen({ navigation }) {
  const { loading: authLoading, error: authError } = useAuth();
  const { posts, query, setQuery, loading, error } = useDiscoverPosts(!authLoading && !authError);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconButton name="menu" size={24} color={colors.white} onPress={() => Alert.alert('Menu', 'More options are coming soon.')} accessibilityLabel="Open menu" />
        <View style={styles.searchBox}>
          <TextInput
            accessibilityLabel="Search posts"
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor="#8f9ba1"
            style={styles.searchInput}
          />
          <IconButton name="magnify" size={19} color="#264554" style={styles.searchIcon} />
        </View>
        <IconButton name="tune-variant" size={22} color={colors.white} onPress={() => Alert.alert('Filters', 'Story filters are coming soon.')} accessibilityLabel="Open filters" />
      </View>

      <DataState loading={authLoading || loading} error={authError || error}>
        <FlatList
          data={posts}
          renderItem={({ item }) => <VideoCard post={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No stories found</Text>}
        />
      </DataState>

      <BottomNavigation navigation={navigation} active="Discover" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.navyTeal },
  header: { height: 66, backgroundColor: colors.navyTeal, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  searchBox: { height: 38, width: '68%', backgroundColor: colors.lightText, borderRadius: 9, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  searchInput: { flex: 1, padding: 0, color: '#193b48', fontSize: 12 },
  searchIcon: { width: 24, height: 30 },
  feed: { padding: 8, paddingBottom: 78, backgroundColor: colors.softBackground },
  emptyText: { textAlign: 'center', color: '#6c7b80', marginTop: 40 },
});
