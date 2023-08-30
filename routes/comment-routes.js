const router = require('express').Router();
commentController = require('../controllers/comment-controller');

router.route("/:requestId")
    .get(commentController.findByRequest)
    // .post(commentController)

module.exports = router;