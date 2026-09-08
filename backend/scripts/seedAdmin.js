require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

async function seed() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) throw new Error('Set valid ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD (8+ characters)');
  await connectDB();
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log('An account with the admin email already exists; no changes made.');
  } else {
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), password: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'admin' });
    console.log('Administrator created successfully.');
  }
  process.exit(0);
}
seed().catch((error) => { console.error(error.message); process.exit(1); });
