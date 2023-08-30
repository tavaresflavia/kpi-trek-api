const knex = require("knex")(require("../knexfile"));

const findAll = (_req, res)=> {
    knex('user')
    .select("username","email","team", "id")
    .then((usersFound) => {
        return res.status(200).json(usersFound);
    })
    .catch(() => {
        res
        .status(500)
        .send(
          `Unable to retrieve user data`
        )}
    );

}

module.exports = {
    findAll
}