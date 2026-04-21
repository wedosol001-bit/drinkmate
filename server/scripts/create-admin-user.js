const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../Models/user-model');

const printUsage = () => {
  console.log('\nUsage: node scripts/create-admin-user.js --email "<email>" --password "<password>"');
  console.log('   or: node scripts/create-admin-user.js "<email>" "<password>"\n');
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  let email = '';
  let password = '';

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--email' && args[i + 1]) {
      email = args[i + 1];
      i += 1;
    } else if (args[i] === '--password' && args[i + 1]) {
      password = args[i + 1];
      i += 1;
    }
  }

  if (!email && args[0] && !args[0].startsWith('--')) {
    email = args[0];
  }
  if (!password && args[1] && !args[1].startsWith('--')) {
    password = args[1];
  }

  return { email: (email || '').trim().toLowerCase(), password: (password || '').trim() };
};

const sanitizeUsernameBase = (email) => {
  const localPart = email.split('@')[0] || 'admin';
  return localPart.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 20) || 'admin';
};

const generateUniqueUsername = async (email) => {
  const base = sanitizeUsernameBase(email);
  let candidate = base;
  let counter = 1;

  while (await User.exists({ username: candidate })) {
    candidate = `${base}${counter}`;
    counter += 1;
  }
  return candidate;
};

const createOrPromoteAdminUser = async ({ email, password }) => {
  if (!email || !password) {
    printUsage();
    throw new Error('Email and password are required.');
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/drinkmate';
  console.log('🔍 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    existingUser.password = password;
    existingUser.isAdmin = true;
    existingUser.role = 'admin';
    existingUser.status = 'active';
    existingUser.emailVerified = true;
    await existingUser.save();
    console.log(`✅ Updated existing user as admin: ${email}`);
    return;
  }

  const username = await generateUniqueUsername(email);
  const newUser = new User({
    username,
    email,
    password,
    name: 'Admin User',
    isAdmin: true,
    role: 'admin',
    status: 'active',
    emailVerified: true,
  });

  await newUser.save();
  console.log(`✅ Created new admin user: ${email}`);
  console.log(`👤 Username: ${username}`);
};

const main = async () => {
  try {
    const input = parseArgs();
    await createOrPromoteAdminUser(input);
  } catch (error) {
    console.error(`❌ Failed to create/promote admin user: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
};

main();
