const knex = require("knex")(require("../knexfile"));
const config = require("../utils/config");

const { isValidEmail, isValidLimits } = config;

const findAll = (req, res) => {
  knex("kpi")
    .where("kpi.created_by", "=", req.params.userId)
    .then((kpisFound) => {
      res.status(200).json(kpisFound);
    })
    .catch(() => {
      res
        .status(500)
        .send(
          `Unable to retrieve kpi data for user with ID: ${req.params.user}`
        );
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
  const { title, description, target, lower_limit, upper_limit, unit } =
    req.body;
  if (!title || !description) {
    return res
      .status(400)
      .send("Unsuccessful. Missing properties in the request body.");
  }
  if (
    !isValidLimits(Number(lower_limit), Number(upper_limit), Number(target))
  ) {
    return res.status(400).send("Invalid limits.");
  }

  knex("kpi")
    .where("id", "=", req.params.kpiId)
    .update({ title, description, target, lower_limit, upper_limit, unit })
    .then((result) => {
      if (result === 0) {
        return res
          .status(404)
          .send(`KPIs with ID: ${req.params.kpiId} not found`);
      }
      return knex("kpi").where("id", "=", req.params.kpiId);
    })
    .then((updatedKpi) => {
      res.status(200).json(updatedKpi);
    })
    .catch(() => {
      res
        .status(500)
        .send(`Unable to update kpi data with ID: ${req.params.kpiId}`);
    });
};

const add = (req, res) => {
  const { created_by, title, description, target, lower_limit, upper_limit } =
    req.body;
  if (!title || !description || !created_by) {
    return res
      .status(400)
      .send("Unsuccessful. Missing properties in the request body.");
  }
  if (
    !isValidLimits(Number(lower_limit), Number(upper_limit), Number(target))
  ) {
    return res.status(400).send("Invalid limits.");
  }

  knex("kpi")
    .insert(req.body)
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).send(`Unable to create new kpi`);
      }
      return knex("kpi").where("id", "=", result[0]).first();
    })
    .then((createdKpi) => {
      return res.status(201).json(createdKpi);
    })
    .catch(() => {
      res.status(500).send(`Unable to create new kpi`);
    });
};

const findEntries = (req, res) => {
  knex("kpi_entry")
  .select("user.username", "value", "observation", "created_at")
    .join("user", "kpi_entry.created_by","user.id" )
    .where("kpi_id", "=", req.params.kpiId)
    .then((entriesFound) => {
      if (entriesFound.length === 0) {
        return res
          .status(400)
          .send(
            `Unable to retrieve historical data for kpi with ID: ${req.params.kpiId}`
          );
      }
      return res.status(200).json(entriesFound);
    })
    .catch(() => {
      res
        .status(500)
        .send(
          `Unable to retrieve historical data for kpi with ID: ${req.params.kpiId}`
        );
    });
};

const addEntry = (req, res) => {
  const { created_by, kpi_id, value } = req.body;
  if (!created_by || !kpi_id || !value) {
    return res
      .status(400)
      .send("Unsuccessful. Missing properties in the request body.");
  }
  knex("kpi_entry")
    .insert(req.body)
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).send("Unable to add new entry");
      }
      return knex("kpi_entry").where("id", "=", result[0]).first();
    })
    .then((createdKpiEntry) => {
      return res.status(201).json(createdKpiEntry);
    })
    .catch(() => {
      res.status(500).send("Unable to add new entry");
    });
};

module.exports = {
  findOne,
  findAll,
  update,
  add,
  addEntry,
  findEntries,
};
