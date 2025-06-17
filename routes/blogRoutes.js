const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createBlog,
  getPublishedBlogs,
  getSingleBlog,
 deleteBlog, getUserBlogs, updateBlog, publishBlog } = require('../controllers/blogController');

router.post('/', auth, createBlog);
router.get('/', getPublishedBlogs);
router.get('/:id', getSingleBlog);

module.exports = router;
router.get('/user/blogs', auth, getUserBlogs);
router.delete('/:id', auth, deleteBlog);
router.patch('/:id', auth, updateBlog);
router.patch('/:id/publish', auth, publishBlog);
