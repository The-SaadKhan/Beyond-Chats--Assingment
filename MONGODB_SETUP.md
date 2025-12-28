# BeyondChats - MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows Installation:

1. **Download MongoDB Community Server**:
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Download and run the installer

2. **Install with default settings**:
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```powershell
   mongod --version
   ```

4. **MongoDB will auto-start** as a Windows service

## Option 2: Use MongoDB Atlas (Cloud - No Installation Needed) ⚡

This is **FASTER** and works immediately without installing anything!

### Steps:

1. **Create Free Account**:
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google/GitHub or email

2. **Create Free Cluster**:
   - Click "Build a Database"
   - Select "M0 Free" tier
   - Choose a cloud provider and region (closest to you)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Setup Database Access**:
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `beyondchats`
   - Password: Auto-generate (copy it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**:
   - Go to "Network Access" in left menu  
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://beyondchats:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Update .env file**:
   - Open `backend/.env`
   - Replace the MONGODB_URI line with your connection string
   - Replace `<password>` with your actual password
   - Example:
   ```env
   MONGODB_URI=mongodb+srv://beyondchats:yourpassword123@cluster0.abcde.mongodb.net/beyondchats?retryWrites=true&w=majority
   ```

## Quick Test

After setting up either option, test the connection:

```powershell
cd backend
npm start
```

You should see:
```
✓ MongoDB connected successfully
🚀 Server running on port 5000
```

## Troubleshooting

### MongoDB Atlas Connection Issues:
- Make sure you replaced `<password>` in connection string
- Check Network Access allows your IP
- Wait a few minutes after creating cluster

### Local MongoDB Issues:
- Check Windows Services for "MongoDB Server"
- Try restarting the service
- Check port 27017 is not in use

## Recommended: Use MongoDB Atlas (Cloud)

**Why Atlas is better for this project:**
- ✅ No installation needed
- ✅ Works immediately
- ✅ Free forever (512MB storage)
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Easy to deploy later

**Only takes 5 minutes to setup!**
