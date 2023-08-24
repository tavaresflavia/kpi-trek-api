const knex = require("knex")(require("../knexfile"));

const findAll = (req, res) => {
  knex("kpi")
    .join("user", "user.id", "kpi.created_by")
    .where("created_by", "=", req.body.userId)
    .then((kpisFound) => {
      if (kpisFound.length === 0) {
        return res
          .status(404)
          .send(`KPIs for user with ID: ${req.body.user} not found`);
      }
      res.status(200).json(kpisFound);
    })
    .catch(() => {
      res
        .status(500)
        .send(`Unable to retrieve kpi data for user with ID: ${req.body.user}`);
    });
};
const findOne = (req, res) => {
  knex("kpi")
    .where("id", "=", req.params.kpiId)
    .then((kpisFound) => {
      if (kpisFound.length === 0) {
        return res
          .status(404)
          .send(`KPIs with ID: ${req.params.kpiId} not found`);
      }
      res.status(200).json(kpisFound);
    })
    .catch(() => {
      res
        .status(500)
        .send(`Unable to retrieve kpi data with ID: ${req.params.kpiId}`);
    });
};
const update = (req, res) => {
  knex("kpi")
    .where("id", "=", req.params.kpiId)
    .update(req.body)
    .then((result) => {
      if (result === 0) {
        return res
          .status(404)
          .send(`KPIs with ID: ${req.params.kpiId} not found`);
      }
      return res.status(200).knex("kpi").where({
        id: req.params.kpiId});
    })
    .catch(() => {
      res
        .status(500)
        .send(`Unable to update kpi data with ID: ${req.params.kpiId}`);
    });
};

// const add = (req,res) => {

// }

module.exports = {
  findOne,
  findAll,
  update,
  // add
};
