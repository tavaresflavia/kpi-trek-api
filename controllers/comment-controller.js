const knex = require("knex")(require("../knexfile"));

const findByRequest = (req,res) => {
    knex('comment')
    .select("user.username as username", "comment.created_at", "content","request_id")
    .join("user", "comment.created_by", "user.id")
    .join("request", "comment.request_id", "request.id")
    .where("comment.request_id", "=", req.params.requestId)
    .andWhere((builder) => {
      builder
        .where("request.assigned_to", "=", req.user.id)
        .orWhere("request.created_by", "=", req.user.id);
    })
    .orderBy( "comment.created_at","desc")
    .then((commentsFound) => {
        res.status(200).json(commentsFound);
      })
      .catch(() => {
        res
          .status(500)
          .send(
            `Unable to retrieve comments from request ID: ${req.params.requestId}`
          );
      });
}

const addComment = (req,res) => {
  req.body.created_by = req.user.id;

  for (const column of ["content","request_id","created_by"]) {
    if (!req.body[column]) {
      return res
        .status(400)
        .send("Unsuccessful. Missing properties in the request body.");
    }
  }
  knex("request")
  .where("id", "=", req.body.request_id)
  .andWhere((builder) => {
    builder
      .where("assigned_to", "=", req.user.id)
      .orWhere("created_by", "=", req.user.id);
  })
  .first()
  .then((requestFound) => {
    if (!requestFound) {
      res.status(403).send("You do not have access to this request.");
      return null;
    }

    return knex('comment').insert(req.body);
  })
  .then((result) =>{
    if (!result) {
      return;
    }

    if (result === 0) {
      return res.status(400).send(`Unable add new comment`);
    }
    return knex("comment").where("id", "=", result[0]).first();
    })
    .then((result) =>{
      return res.status(200).json(result)

    })
    .catch(() => {
      res.status(500).send(`Unable to add new comment`);
    });


}

module.exports = {
    findByRequest,
    addComment
}
