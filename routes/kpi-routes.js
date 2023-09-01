const router = require("express").Router();
kpiController = require("../controllers/kpi-controller");

router.route("/")
    .post(kpiController.add)

router.route("/entries")
    .post(kpiController.addEntry)

router.route("/:userId")
    .get(kpiController.findAll)

router.route("/entries/:kpiId")
    .get(kpiController.findEntries)

router.route("/:kpiId")
    // .get(kpiController.findOne)
    .put(kpiController.update)


module.exports = router;




