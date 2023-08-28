/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("user", (table) =>{
        table.increments("id").primary();
        table.string("username").notNullable();
        table.string("email").notNullable();
        table.string("team");
        table.string("google_id");
        table.string("avatar_url");
    
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("user");
  
};
