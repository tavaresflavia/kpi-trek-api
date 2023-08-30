const router = require('express').Router();
userController = require('../controllers/user-controller');


router.route("/")
    .get(userController.findAll)

module.exports = router