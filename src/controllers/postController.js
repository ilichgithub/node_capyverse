const Post = require('../models/postModel');

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user.id });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find().populate('author', 'username');
  res.json(posts);
};

exports.getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  if (!post) return res.status(404).json({ error: 'Post no encontrado' });
  res.json(post);
};

exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.author.toString() !== req.user.id)
    return res.status(403).json({ error: 'No autorizado' });

  Object.assign(post, req.body);
  await post.save();
  res.json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
  }
  if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No estás autorizado para eliminar este post' });
  }
  await post.deleteOne();
  res.status(200).json({ message: 'Post eliminado' });
};