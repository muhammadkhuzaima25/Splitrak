const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ name, email, password })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, phone, role } = req.body
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (name) user.name = name
    await user.save()
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: phone || '',
      role: role || '',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }
    user.password = newPassword
    await user.save()
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { registerUser, loginUser, updateProfile, changePassword }
