const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use(errorHandler);

module.exports = app;