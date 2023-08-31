const knex = require("knex")(require("../knexfile"));

const findByRequest = (req,res) => {
    knex('comment')
    .select("user.username as username", "comment.created_at", "comment.content","comment.request_id")
    .join("user", "comment.created_by", "user.id")
    .where("comment.request_id", "=", req.params.requestId)
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
  ["content","request_id","created_by"].forEach((column) => {
    if (!req.body[column]) {
      return res
        .status(400)
        .send("Unsuccessful. Missing properties in the request body.");
    }
  });
  knex('comment')
  .insert(req.body)
  .then((result) =>{
    if (result === 0) {
      return res.status(400).send(`Unable add new comment`);
    }
    return knex("comment").where("id", "=", result[0]).first();
    })
    .catch(() => {
      res.status(500).send(`Unable to add new comment`);
    });


}

module.exports = {
    findByRequest,
    addComment
}