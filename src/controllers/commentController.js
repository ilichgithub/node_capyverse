const Comment = require('../models/commentModel');

exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user.id,
      post: req.params.postId
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'username');
  res.json(comments);
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment || comment.author.toString() !== req.user.id)
    return res.status(403).json({ error: 'No autorizado' });

  await comment.remove();
  res.json({ message: 'Comentario eliminado' });
};