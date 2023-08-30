const router = require('express').Router();
requestController = require('../controllers/request-controller')

router.route("/")
    .post(requestController.add)

router.route("/assignedto/:userId")
    .get(requestController.findAssignedToMe)

router.route("/createdby/:userId")
    .get(requestController.findCreatedByMe)

router.route("/kpi/:kpiId")
    .get(requestController.findByKpiId)

router.route("/:requestId")
    .get(requestController.findOne)
    .put(requestController.update)





module.exports = router;