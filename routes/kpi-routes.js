const router = require("express").Router();
kpiController = require("../controllers/kpi-controller");

router.route("/")
    .get(kpiController.findAll)
    .post(kpiController.add)

router.route("/entries/:kpiId")
    .get(kpiController.findEntries)

router.route("/:kpiId")
    .get(kpiController.findOne)
    .put(kpiController.update)


module.exports = router;




