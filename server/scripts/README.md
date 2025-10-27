# Server Scripts

## Delete Aqualine Bundle

To delete the "Aqualine Starter Kit Soda Maker" bundle from the database:

```bash
cd server
node scripts/deleteAqualineBundle.js
```

Make sure your MongoDB connection string is set in `.env` as `MONGODB_URI`.

The script will:
1. Connect to MongoDB
2. Find all bundles with "Aqualine" in the name
3. List them for confirmation
4. Delete matching bundles
5. Confirm deletion

