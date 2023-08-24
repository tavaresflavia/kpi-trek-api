const router = require("express");
kpiController = require("../controllers/kpi-controller");

router.route("/")
    .get(kpiController.findAll)

router.route("/:kpiId")
    .get(kpiController.findOne)

router.route("/:kpiId/requests")


router.route("/:kpiId/entries")





