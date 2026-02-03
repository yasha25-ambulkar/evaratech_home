# Supabase Database Setup Instructions

## Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your project: `vrijzzzjeshbhkikvdfx`

## Step 2: Create Database Tables

1. Click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the contents of `supabase_schema.sql`
4. Click "Run" to execute the SQL

This will create:
- `assets` table
- `pipelines` table
- Indexes for performance
- Row Level Security policies
- Triggers for updated_at timestamps

## Step 3: Migrate Data to Supabase

### Option A: Using the Migration Script (Recommended)

1. Open the developer console in your browser (F12)
2. Navigate to http://localhost:5173/map
3. In the console, run:
```javascript
import { runMigration } from './src/scripts/migrateToSupabase';
runMigration();
```

### Option B: Manual Data Entry

You can also manually insert data through the Supabase dashboard:

1. Go to "Table Editor"
2. Select "assets" or "pipelines" table
3. Click "Insert row"
4. Fill in the data

## Step 4: Verify Data

1. Go to "Table Editor" in Supabase dashboard
2. Click on "assets" table - should see ~65 rows
3. Click on "pipelines" table - should see ~20 rows

## Step 5: Test Real-time Updates

1. In Supabase dashboard, go to "Database" > "Replication"
2. Ensure replication is enabled for both tables
3. Make a change to any row
4. The change should appear in your app immediately

## Troubleshooting

### If tables don't create:
- Check for SQL syntax errors
- Ensure you have proper permissions
- Try creating tables one at a time

### If data doesn't load:
- Check browser console for errors
- Verify environment variables in `.env.local`
- Check Supabase API logs in dashboard

### If real-time doesn't work:
- Ensure RLS policies allow SELECT
- Check that replication is enabled
- Verify subscription code is running

## Security Notes

- Never commit `.env.local` to git
- Use Row Level Security (RLS) policies
- The anon key is safe for client-side use
- For write operations, consider adding authentication

## Next Steps

After successful setup:
1. Test the map page - assets should load from Supabase
2. Try toggling layer visibility
3. Click on assets to see details
4. Monitor real-time updates in the console
