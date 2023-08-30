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
  knex('comment')


}

module.exports = {
    findByRequest,
    addComment
}