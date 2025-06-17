const Blog = require('../models/Blog');
const readingTime = require('../utils/readingTime');

exports.createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;
    const blog = await Blog.create({
      title,
      description,
      tags,
      body,
      author: req.user.id,
      reading_time: readingTime(body),
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPublishedBlogs = async (req, res) => {
  const { page = 1, limit = 20, title, tags, author, order_by } = req.query;
  const filter = { state: 'published' };
  if (title) filter.title = new RegExp(title, 'i');
  if (tags) filter.tags = { $in: tags.split(',') };
  if (author) filter.author = new RegExp(author, 'i');
  const sort = {};
  if (order_by) sort[order_by] = -1;

  const blogs = await Blog.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('author', 'first_name last_name email');
  res.json(blogs);
};

exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');
    if (!blog || blog.state !== 'published') return res.status(404).json({ error: 'Not found' });
    blog.read_count++;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    await blog.remove();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const { state, page = 1, limit = 10 } = req.query;
    const filter = { author: req.user.id };
    if (state) filter.state = state;

    const blogs = await Blog.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ timestamp: -1 });

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    Object.assign(blog, req.body);
    blog.reading_time = calculateReadingTime(blog.body || '');
    await blog.save();

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    blog.state = 'published';
    await blog.save();

    res.status(200).json({ message: 'Blog published successfully', blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
