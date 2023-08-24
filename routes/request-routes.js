const router = require('express').Router();
requestController = require('../controllers/request-controller')

router.route("/assignedto")
    .get(requestController.findAssignedToMe)

module.exports = router;