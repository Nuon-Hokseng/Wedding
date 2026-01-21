# Debugging: Wishes Feed Not Showing Data

## Problem Summary

- Wishes are being **inserted successfully** into the database
- But they **don't appear** on the Wishes Feed display
- The server has data but the client can't read it

## Most Likely Cause: Row Level Security (RLS)

**90% chance this is the issue:** The `wishes_feed` table has RLS (Row Level Security) enabled, which prevents anonymous users from reading the data.

### How to Verify

1. **Check browser console** for errors (press F12 → Console):
   - Look for messages with emoji indicators: ❌, ✅, ℹ️, 💡
   - These will show exact Supabase errors

2. **Expected error message if RLS is the problem:**
   ```
   Error Code: 42501
   Message: "new row violates row-level security policy"
   ```

## Solutions (Choose One)

### Solution 1: Disable RLS (Easiest for Public Data)

If wishes are meant to be publicly visible, disable RLS entirely:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to: **SQL Editor** → **Queries** (or use the table view)
3. Go to **Auth** → **Policies** in the left sidebar
4. Find the `wishes_feed` table
5. **Disable RLS** using the toggle switch
6. Confirm the change

**SQL Alternative:**

```sql
ALTER TABLE wishes_feed DISABLE ROW LEVEL SECURITY;
```

### Solution 2: Create Public Read Policy (Recommended)

If you want to keep RLS but allow public reads:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to: **Authentication** → **Policies**
3. Click on `wishes_feed` table
4. Click **New Policy**
5. Choose **For SELECT** (read)
6. Select **Using:** `true` (allows all)
7. Apply the policy

**SQL Alternative:**

```sql
CREATE POLICY "Allow public read on wishes_feed" ON wishes_feed
  FOR SELECT
  USING (true);
```

### Solution 3: Restrict to Authenticated Users

If only authenticated users should see wishes:

**SQL:**

```sql
CREATE POLICY "Allow authenticated users to read wishes" ON wishes_feed
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

## Database Table Requirements

The `wishes_feed` table **MUST** have these columns:

```
- id (bigint, primary key)
- guest_id (bigint, foreign key to guests)
- name (text)
- number_of_guests (integer)
- will_attend (boolean)
- message (text)
- created_at (timestamp with timezone)
```

## Testing After Fix

1. Add a new wish through the RSVP form
2. Refresh the page or check browser console
3. Look for the console message: **✅ Successfully fetched wishes: N**
4. Wishes should now appear on the Wishes Feed section

## Code Changes Made

Enhanced error logging in:

- [components/WishesFeed.tsx](../components/WishesFeed.tsx) - Better error messages
- [components/RSVP.tsx](../components/RSVP.tsx) - Insert success logging

## Debug Console Output

**When it works (✅):**

```
✅ Successfully fetched wishes: 5
```

**When RLS blocks it (❌):**

```
❌ Error fetching wishes from Supabase: {
  message: "new row violates row-level security policy",
  code: "42501",
  ...
}
```

**When no wishes exist (ℹ️):**

```
ℹ️ No wishes found in the database
```

## Next Steps

1. **Immediately:** Check browser console (F12) for the exact error
2. **Apply one of the three solutions above**
3. **Test:** Submit a wish and verify it appears
4. **Monitor:** Watch browser console for any remaining errors

---

**Questions?** Check the Supabase documentation:

- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Policies Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
