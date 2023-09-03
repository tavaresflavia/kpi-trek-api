const router = require('express').Router();
requestController = require('../controllers/request-controller')

router.route("/")
    .post(requestController.add)

router.route("/:userId")
    .get(requestController.findAll)

router.route("/assignedto/:userId")
    .get(requestController.findAssignedToMe)

router.route("/createdby/:userId")
    .get(requestController.findCreatedByMe)

router.route("/kpi/:kpiId")
    .get(requestController.findByKpiId)

router.route("/:requestId")
    .patch(requestController.update)
    
    

module.exports = router;    