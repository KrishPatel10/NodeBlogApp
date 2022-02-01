const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/create', blogController.blog_create_get);
router.get('/', blogController.blog_reg);
router.post('/', blogController.blog_create_post);
router.get('/:id', blogController.blog_details);
router.get('/register', blogController.blog_reg);
router.delete('/:id', blogController.blog_delete);
router.get('/update/:id', blogController.blog_update_get);
router.get('/update/:id', blogController.blog_update_post);

module.exports = router;