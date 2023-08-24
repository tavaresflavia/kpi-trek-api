const router = require("express").Router();
kpiController = require("../controllers/kpi-controller");

router.route("/")
    .get(kpiController.findAll)

router.route("/:kpiId")
    .get(kpiController.findOne)
    .post(kpiController.update)

// router.route("/:kpiId/requests")


// router.route("/:kpiId/entries")

module.exports = router;




