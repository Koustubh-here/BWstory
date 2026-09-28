import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFollowLists, removeFollower as deleteFollower, setFollowing } from '../lib/supabaseData';

export default function useProfileFollowers(userId) {
  const [tab, setTab] = useState('Followers');
  const [query, setQuery] = useState('');
  const [lists, setLists] = useState({ followers: [], following: [] });
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      setLists(await getFollowLists(userId));
      setError(null);
    } catch (nextError) {
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const visibleFollowers = useMemo(() => {
    const search = query.trim().toLowerCase();
    const list = tab === 'Followers' ? lists.followers : lists.following;
    return search ? list.filter(person => `${person.name} ${person.number}`.toLowerCase().includes(search)) : list;
  }, [lists, query, tab]);

  const toggleFollowing = async person => {
    const nextValue = !person.isFollowing;
    setLists(current => ({
      followers: current.followers.map(item => item.id === person.id ? { ...item, isFollowing: nextValue } : item),
      following: current.following.map(item => item.id === person.id ? { ...item, isFollowing: nextValue } : item),
    }));
    try {
      await setFollowing(userId, person.id, nextValue);
    } catch (nextError) {
      await load();
      setError(nextError);
    }
  };

  const removeFollower = async person => {
    setLists(current => ({ ...current, followers: current.followers.filter(item => item.id !== person.id) }));
    try {
      await deleteFollower(userId, person.id);
    } catch (nextError) {
      await load();
      setError(nextError);
    }
  };

  return { tab, setTab, query, setQuery, visibleFollowers, followersCount: lists.followers.length, followingCount: lists.following.length, loading, error, toggleFollowing, removeFollower, reload: load };
}
