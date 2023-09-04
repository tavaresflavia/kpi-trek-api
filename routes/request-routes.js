const router = require("express").Router();
requestController = require("../controllers/request-controller");

router.route("/").post(requestController.add);

router.route("/:userId").get(requestController.findAll);

router.route("/assignment/:userId").get(requestController.findByAssignment);

router.route("/kpi/:kpiId").get(requestController.findByKpiId);

router.route("/:requestId").patch(requestController.update);

router.route("/single/:requestId").get(requestController.findOne);

module.exports = router;
