import { useEffect, useMemo, useState } from 'react';
import { getPosts } from '../lib/supabaseData';

export default function useDiscoverPosts(enabled = true) {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    getPosts().then(setPosts).catch(setError).finally(() => setLoading(false));
    return undefined;
  }, [enabled]);

  const visiblePosts = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return posts;
    return posts.filter(post => `${post.author_name} ${post.headline} ${post.location}`.toLowerCase().includes(search));
  }, [posts, query]);

  return { posts: visiblePosts, query, setQuery, loading, error };
}
