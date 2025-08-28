const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

exports.createComment = async (req, res) => {
  try {  
    const post = await Post.findById(req.params.postId).populate('author', 'username');
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    
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
  if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No estás autorizado para eliminar este comentario' });
  }
  await comment.deleteOne();
  res.status(200).json({ message: 'Comentario eliminado' });
};