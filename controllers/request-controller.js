const knex = require("knex")(require("../knexfile"));
const config = require("../utils/config");
const { requestColumns } = config;

const findOne = (req, res) => {
  knex("request")
    .where("id", "=", req.params.requestId)
    .then((requestsFound) => {
      if (requestsFound.length === 0) {
        return res
          .status(404)
          .send(`Request with ID: ${req.body.requestId} not found`);
      }
      res.status(200).json(requestsFound);
    })
    .catch(() => {
      res
        .status(500)
        .send(
          `Unable to retrieve request data for request ID: ${req.body.requestId}`
        );
    });
};

const findAssignedToMe = (req, res) => {
  knex("request")
    .select(
      "request.id",
      "request.title",
      "request.description",
      " request.rpn",
      "request.request_status",
      "kpi.title as kpi_title",
      "request.created_at",
      "u1.username as created_by",
      "u2.username as assigned_to"
    )
    .join("kpi", "request.kpi_id", "kpi.id")
    .leftJoin("user as u1", "request.created_by", "u1.id")
    .leftJoin("user as u2", "request.assigned_to", "u2.id")
    .where("request.assigned_to", "=", req.params.userId)
    .orderBy(`request.${ req.query.sort === "rpn" ? "rpn":"created_at"}`, 'desc')
    .then((requestsFound) => {
      if (requestsFound.length === 0) {
        return res
          .status(404)
          .send(`Requests for user with ID: ${req.params.userId} not found`);
      }
      return res.status(200).json(requestsFound);
    })
    .catch(() => {
      res
        .status(500)
        .send(
          `Unable to retrieve request data for user with ID: ${req.params.userId}`
        );
    });
};

const findCreatedByMe = (req, res) => {
  knex("request")
    .select(
      "request.id",
      "request.title",
      "request.description",
      " request.rpn",
      "request.request_status",
      "kpi.title as kpi_title",
      "request.created_at",
      "u1.username as created_by",
      "u2.username as assigned_to"
    )
    .join("kpi", "request.kpi_id", "kpi.id")
    .leftJoin("user as u1", "request.created_by", "u1.id")
    .leftJoin("user as u2", "request.assigned_to", "u2.id")
    .where("request.created_by", "=", req.params.userId)
    .orderBy(`request.${req.query.sort}`, 'desc')
    .then((requestsFound) => {
      if (requestsFound.length === 0) {
        return res
          .status(404)
          .send(`Requests for user with ID: ${req.params.userId} not found`);
      }
      res.status(200).json(requestsFound);
    })
    .catch(() => {
      res
        .status(500)
        .send(
          `Unable to retrieve request data for user with ID: ${req.params.userId}`
        );
    });
};

const findByKpiId = (req, res) => {
  knex("request")
    .join("kpi", "kpi.id", "request.kpi_id")
    .where("kpi_id", "=", req.params.kpiId)
    .then((requestsFound) => {
      if (requestsFound.length === 0) {
        return res
          .status(404)
          .send(`Requests for user with KPI ID: ${req.params.kpiId} not found`);
      }
      res.status(200).json(requestsFound);
    })
    .catch(() => {
      res
        .status(500)
        .send(
          `Unable to retrieve request data for user with KPI ID: ${req.params.kpiId}`
        );
    });
};

const update = (req, res) => {
    if (!req.body.request_status) {
      return res
        .status(400)
        .send("Unsuccessful. Missing status in the request body.");
    };
  knex("request")
    .where("id", "=", req.params.requestId)
    .update(req.body)
    .then((result) => {
      if (result === 0) {
        return res
          .status(400)
          .send(`Unable to update request ${req.params.requestId}`);
      }

      return knex("request").where("id", "=", req.params.requestId).first();
    })
    .then((updatedRequest) => {
      res.status(201).json(updatedRequest);
    })
    .catch(() => {
      res.status(500).send(`Unable to update request ${req.params.requestId}`);
    });
};

const add = (req, res) => {
  requestColumns.forEach((column) => {
    if (!req.body[column]) {
      return res
        .status(400)
        .send("Unsuccessful. Missing properties in the request body.");
    }
  });
  knex("request")
    .insert(req.body)
    .then((result) => {
      if (result === 0) {
        return res.status(400).send(`Unable to create new request`);
      }

      return knex("request").where("id", "=", result[0]).first();
    })
    .then((createdRequest) => {
      return res.status(201).json(createdRequest);
    })
    .catch(() => {
      res.status(500).send(`Unable to create new request`);
    });
};

module.exports = {
  findAssignedToMe,
  findCreatedByMe,
  findByKpiId,
  findOne,
  update,
  add,
};
