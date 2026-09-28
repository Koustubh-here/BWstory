import { demoProfileId, supabase } from '../config/supabase';

export async function getCurrentUser() {
    return { id: demoProfileId };
}

export async function getProfile(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('No profile data found. Run schema.sql first, then run seed.sql in Supabase SQL Editor.');
    return { ...data, username: data.name, avatar: data.avatar_url };
}

export async function updateProfile(userId, profile) {
    const { data, error } = await supabase.from('profiles').update({
        name: profile.username || profile.name,
        gender: profile.gender,
        location: profile.location,
        profession: profile.profession,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
    }).eq('id', userId).select().single();
    if (error) throw error;
    return { ...data, username: data.name, avatar: data.avatar_url };
}

export async function uploadAvatar(userId, uri) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const path = `${userId}/avatar-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
}

export async function getPosts() {
    const { data, error } = await supabase.from('posts').select('*, profile:profiles!posts_profile_id_fkey(name, avatar_url)').order('date_posted', { ascending: false });
    if (error) throw error;
    if (!data?.length) throw new Error('No stories found in Supabase. Run seed.sql in Supabase SQL Editor.');
    return data.map(post => ({
        ...post,
        author_name: post.profile?.name || 'Unknown user',
        author_avatar_url: post.profile?.avatar_url,
        date: new Date(post.date_posted).toLocaleDateString(),
        duration: `${Math.floor(post.duration_seconds / 60)}:${String(post.duration_seconds % 60).padStart(2, '0')}`,
        progress: 0,
        is_following: false,
    }));
}

export async function getProfilePosts(userId) {
    const { data, error } = await supabase.from('posts').select('*').eq('profile_id', userId).order('date_posted', { ascending: false });
    if (error) throw error;
    return data;
}

export async function getFollowLists(userId) {
    const [followersResult, followingResult] = await Promise.all([
        supabase.from('followers').select('*').eq('profile_id', userId).eq('relationship_type', 'follower'),
        supabase.from('followers').select('*').eq('profile_id', userId).eq('relationship_type', 'following'),
    ]);
    if (followersResult.error) throw followersResult.error;
    if (followingResult.error) throw followingResult.error;
    const normalize = row => ({ id: row.id, name: row.follower_name, number: row.follower_handle, avatar: row.follower_avatar_url, isFollowing: row.relationship_type === 'following' });
    return { followers: followersResult.data.map(normalize), following: followingResult.data.map(normalize) };
}

export async function setFollowing(userId, personId, shouldFollow) {
    const request = supabase.from('followers').update({ relationship_type: shouldFollow ? 'following' : 'follower' }).eq('id', personId).eq('profile_id', userId);
    const { error } = await request;
    if (error) throw error;
}

export async function removeFollower(profileId, followerId) {
    const { error } = await supabase.from('followers').delete().eq('id', followerId).eq('profile_id', profileId);
    if (error) throw error;
}
