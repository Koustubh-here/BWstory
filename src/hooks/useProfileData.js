import { useCallback, useEffect, useState } from 'react';
import { getProfile, getProfilePosts } from '../lib/supabaseData';

export default function useProfileData(userId) {
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(Boolean(userId));
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const [nextProfile, nextPosts] = await Promise.all([getProfile(userId), getProfilePosts(userId)]);
            setProfile({ ...nextProfile, avatar: nextProfile.avatar_url });
            setPosts(nextPosts);
            setError(null);
        } catch (nextError) {
            setError(nextError);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { load(); }, [load]);

    return { profile, posts, loading, error, reload: load };
}
