const knex = require("knex")(require("../knexfile"));
const config = require("../utils/config");

const { isValidEmail, isValidLimits } = config;

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
  const { title, description, target, lower_limit, upper_limit, unit } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .send("Unsuccessful. Missing properties in the request body.");
  }
  if (!isValidLimits(Number(lower_limit), Number(upper_limit), Number(target)) ) {
    return res
      .status(400)
      .send("Invalid limits.");
  }

  knex("kpi")
    .where("id", "=", req.params.kpiId)
    .update({ title, description, target, lower_limit, upper_limit, unit } )
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
  const { created_by, title, description, target, lower_limit, upper_limit, unit } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .send("Unsuccessful. Missing properties in the request body.");
  }
  if (!isValidLimits(Number(lower_limit), Number(upper_limit), Number(target)) ) {
    return res
      .status(400)
      .send("Invalid limits.");
  }
  console.log("get here")

  knex("kpi")
  .insert({ title, description, target, lower_limit, upper_limit, unit,  created_by } )
  .then((result) => {
    if (result.length === 0) {
      return res
        .status(404)
        .send(`Unable to create new kpi`);
    }
    return knex("kpi").where("id","=",result[0]).first();
  })
  .then((createdKpi) =>{
   return res.status(201).json(createdKpi);
  }

  )
  .catch(() => {
    res
      .status(500)
      .send(`Unable to create new kpi`);
  });

};

const findEntries = (req,res) => {
  knex("kpi")
    .join("kpi_entry","kpi_entry.kpi_id","kpi.id")
    .where("kpi.id","=", req.params.kpiId)
    .then((entriesFound)=>{
      if (entriesFound.length === 0){
        return res.status(400).send(`Unable to retrieve historical data for kpi with ID: ${req.body.kpiId}`)

      }
      return res.status(200).json(entriesFound);
    })
    .catch(() => {
      res
        .status(500)
        .send(`Unable to retrieve historical data for kpi with ID: ${req.body.kpiId}`);
    });

}

module.exports = {
  findOne,
  findAll,
  update,
  add,
  findEntries
};
