const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const postCtrl = require('../controllers/postController');

router.get('/', postCtrl.getPosts);
router.get('/:id', postCtrl.getPostById);
router.post('/', auth, postCtrl.createPost);
router.put('/:id', auth, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);

module.exports = router;