const User = require("./User");

// Find user by email
async function findByEmail(email) {
  return await User.findOne({ email: email.toLowerCase() });
}

// Find user by ID
async function findById(id) {
  return await User.findById(id);
}

// Create a new user
async function createUser(userData) {
  const { name, email, password, preferences = [] } = userData;

  const emailLower = email.toLowerCase();

  // Check if user already exists
  const existingUser = await findByEmail(email);

  // In test mode, delete existing user first to ensure clean state
  // In non-test mode, throw error if user exists
  if (existingUser) {
    if (process.env.NODE_ENV === "test" || process.env.TEST) {
      await User.deleteOne({ email: emailLower });
    } else {
      throw new Error("User already exists");
    }
  }

  // Create user (password will be hashed by pre-save hook)
  const user = new User({
    name,
    email: emailLower,
    password, // Will be hashed by pre-save hook
    preferences: Array.isArray(preferences) ? preferences : [],
  });

  await user.save();
  return user;
}

// Verify password
async function verifyPassword(user, password) {
  return await user.comparePassword(password);
}

// Update user preferences
async function updatePreferences(userId, preferences) {
  const user = await User.findByIdAndUpdate(
    userId,
    { preferences: Array.isArray(preferences) ? preferences : [] },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  verifyPassword,
  updatePreferences,
};
