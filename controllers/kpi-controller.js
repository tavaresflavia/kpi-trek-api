const knex = require('knex')(require('../knexfile'));

const findOne = (req,res) => {
    knex("kpi")
        .join(user, user_id, created_by)
        .where({created_by: req.params.userId})
        .then((kpisFound) => {
            
        })

}
const findAll = (req,res) => {

}
const update = (req,res) => {

}
const add = (req,res) => {

}

module.exports = {
    findOne,
    findAll,
    update,
    add
    
}