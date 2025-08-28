const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const commentCtrl = require('../controllers/commentController');

router.get('/:postId', commentCtrl.getCommentsByPost);
router.post('/:postId', auth, commentCtrl.createComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;