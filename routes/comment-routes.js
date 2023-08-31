const router = require('express').Router();
commentController = require('../controllers/comment-controller');

router.route("/:requestId")
    .get(commentController.findByRequest)

router.route("/")
    .post(commentController.addComment)

module.exports = router;