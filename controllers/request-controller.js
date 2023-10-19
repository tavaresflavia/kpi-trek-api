const knex = require("knex")(require("../knexfile"));
const config = require("../utils/config");
const nodemailer = require("nodemailer");

const { requestColumns, requestQueryColumns } = config;

const findAll = (req, res) => {
  knex("request")
    .select(requestQueryColumns)
    .join("kpi", "request.kpi_id", "kpi.id")
    .leftJoin("user as u1", "request.created_by", "u1.id")
    .leftJoin("user as u2", "request.assigned_to", "u2.id")
    .where("request.assigned_to", "=", req.params.userId)
    .orWhere("request.created_by", "=", req.params.userId)
    .orderBy(
      `request.${req.query.sort === "rpn" ? "rpn" : "created_at"}`,
      "desc"
    )
    .then((requestsFound) => {
      if (requestsFound.length === 0) {
        return res.status(404).send(`Unable to retrieve requests`);
      }
      res.status(200).json(requestsFound);
    })
    .catch(() => {
      res.status(500).send(`Unable to retrieve requests`);
    });
};

const findOne = (req, res) => {
  knex("request")
    .select(requestQueryColumns)
    .where("request.id", "=", req.params.requestId)
    .join("kpi", "request.kpi_id", "kpi.id")
    .leftJoin("user as u1", "request.created_by", "u1.id")
    .leftJoin("user as u2", "request.assigned_to", "u2.id")
    .then((requestsFound) => {
      if (requestsFound.length === 0) {
        return res.status(404).send(`Unable to retrieve requests`);
      }
      res.status(200).json(requestsFound);
    })
    .catch(() => {
      res.status(500).send(`Unable to retrieve requests`);
    });
};

const findByAssignment = (req, res) => {
  knex("request")
    .select(requestQueryColumns)
    .join("kpi", "request.kpi_id", "kpi.id")
    .leftJoin("user as u1", "request.created_by", "u1.id")
    .leftJoin("user as u2", "request.assigned_to", "u2.id")
    .where(`request.${req.query.assign}`, "=", req.params.userId)
    .orderBy(
      `request.${req.query.sort === "rpn" ? "rpn" : "created_at"}`,
      "desc"
    )
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

const findByKpiId = (req, res) => {
  knex("request")
    .select("id", "rpn", "created_at", "request_status", "title")
    .where("kpi_id", "=", req.params.kpiId)
    .orderBy("created_at", "desc")
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
  }
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
  const insertRequest = knex("request")
    .insert(req.body)
    .then((result) => {

      if (result === 0) {
        return res.status(400).send(`Unable to create new request`);
      }
      return knex("request").where("id", "=", result[0]).first();
      
    })
    .then(async (createdRequest) => {
      const assignee = await knex("user").where("id", "=", req.body.assigned_to).first();
      return [createdRequest,assignee];
    })
    .then(async (result) => {
      const assignor = await knex("user")
        .where("id", "=", req.body.created_by)
        .first();
      return [...result, assignor];
    })
    .then((results) => {
      const [createdRequest,assignee, assignor] = results;

      const mailTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      mailTransporter.verify().then(console.log).catch(console.error);

      let mailDetails = {
        from: process.env.EMAIL,
        to: `${assignee.email}`,
        subject: `[KPI Trek] - ${assignor.username} assigned ${req.body.title} to you`,
        html: `<div style="display:flex; justify-content:center;height:80px; width:100%"><img style="height:80px;" src=${`${process.env.SERVER_HOST}/assets/images/logo.png`}></img></div>
        <h2 style="font-weight:700; color:#303c6c;">Hi ${assignee.username},</h2> 
        <p style="font-size:14px;"> ${assignor.username} assigned a new request to you. </p>
        <h3 style="text-align: center;font-weight:600; color:#303c6c;">${req.body.title}</h3> 
        <div style="display:flex; justify-content:center;"><p style="text-align: center;margin-block: 16px; width:300px; padding: 16px; box-shadow: 0 0 8px 4px #d0d0d0; border-radius: 0.625rem;">${req.body.description}</p></div>
        <div style="display:flex; justify-content:center;"><a style="font-weight:400; font-size:14px; padding: 8px 16px; border-radius:20px;background-color:#303c6c; color:#fff; margin:auto; text-decoration:none;" href=${`${process.env.CLIENT_HOST}/Request/${createdRequest.id}`}>View Request</a></div>`,
      };

      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("Error Occurs");
          console.log(err);
        } else {
          console.log("Email sent successfully");
        }
      });
      return createdRequest
    })
    .then((createdRequest) => {
      return res.status(201).send(createdRequest);
    })
    .catch(() => {
      res.status(500).send(`Unable to create new request`);
    });
};

module.exports = {
  findByAssignment,
  findByKpiId,
  findAll,
  findOne,
  update,
  add,
};
