const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('REGISTER REQUEST:', req.body);

    const {
      name,
      phoneNumber,
      email,
      password,
    } = req.body;

    if (!name || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Name, phone number and password are required.',
      });
    }

    const cleanName = name.trim();
    const cleanPhone = phoneNumber.trim();
    const cleanEmail =
      email?.trim().toLowerCase() || undefined;

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Name must contain at least 2 characters.',
      });
    }

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message:
          'Enter a valid 10-digit phone number.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain at least 8 characters.',
      });
    }

    const existingPhone = await User.findOne({
      phoneNumber: cleanPhone,
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message:
          'An account with this phone number already exists.',
      });
    }

    if (cleanEmail) {
      const existingEmail = await User.findOne({
        email: cleanEmail,
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message:
            'An account with this email already exists.',
        });
      }
    }

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    const user = await User.create({
      name: cleanName,
      phoneNumber: cleanPhone,
      email: cleanEmail,
      passwordHash,
    });

    console.log(
      'CUSTOMER CREATED:',
      user._id.toString()
    );

    return res.status(201).json({
      success: true,
      message:
        'Customer registered successfully.',
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email || null,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      'REGISTRATION ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const {
      phoneNumber,
      password,
    } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Phone number and password are required.',
      });
    }

    const cleanPhone = phoneNumber.trim();

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message:
          'Enter a valid 10-digit phone number.',
      });
    }

    const user = await User.findOne({
      phoneNumber: cleanPhone,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid phone number or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          'This account has been disabled.',
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid phone number or password.',
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          'JWT_SECRET is missing from .env',
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email || null,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      'LOGIN ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;