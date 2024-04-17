// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { validateSignup } = require('../../utils/validateSomeRoutes');
const { User } = require('../../db/models');
const router = express.Router();

// Sign up
router.post('/', validateSignup, async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    let existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists', errors: { email: 'A user with this email already exists' } });
    }

    existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists', errors: { username: 'A user with this username already exists' } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.status(201).json({ user: safeUser });
  } catch (error) {
    console.error('Error during sign up:', error); // Log internal error
    return res.status(500).json({ message: 'Internal server error' }); // Send generic error message to client
  }
});

module.exports = router;
