const userData = require("../seed-data/users");
const kpiData = require("../seed-data/kpis");
const kpiEntriesData = require("../seed-data/kpi_entries");
const requestData = require("../seed-data/requests");
const commentData = require("../seed-data/comments");

exports.seed = (knex) =>{
    return knex('kpi_entry')
    .del()
    .then(() => {
        return knex('comment').del();
    })
    .then(() => {
        return knex('request').del();
    })
    .then(() => {
        return knex('kpi').del();
    })
    .then(() => {
        return knex('user').del();
    })
    .then( () => {
        return knex('user').insert(userData);
    })
    .then( () => {
        return knex('kpi').insert(kpiData);
    })
    .then( () => {
        return knex('request').insert(requestData);
    })
    .then( () => {
        return knex('comment').insert(commentData);
    })
    .then( () => {
        return knex('kpi_entry').insert(kpiEntriesData);
    })
  
}