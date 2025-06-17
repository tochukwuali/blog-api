const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const user = await User.create({ first_name, last_name, email, password });
    const token = createToken(user._id);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};