# Supabase setup

1. Open the Supabase project SQL Editor.
2. Run all of `schema.sql` in this folder. It resets the old demo tables first.
3. Run all of `seed.sql` in this folder to create profiles, followers, posts, and video records.
4. Copy the project URL and anon public key from Project Settings > API.
5. Replace the values in `src/config/supabase.js`.
6. Rebuild the app with `npx react-native run-android`.

The SQL creates:

- `profiles` for editable user profiles
- `posts` for Discover and profile posts
- `follows` for follower/following toggles
- An `avatars` Storage bucket and access policies
- Seed demo content is provided separately in `seed.sql`

The app uses the Supabase anon/public key without a login session for this demo. The anon key is intended for client apps, but the open write policies in this schema must be replaced before production.

`seed.sql` creates database records and Storage buckets. SQL cannot upload local video binaries, so upload actual video files separately in Storage under `videos/<user-id>/`. The seeded posts use public sample video URLs so the feed has playable records immediately.
