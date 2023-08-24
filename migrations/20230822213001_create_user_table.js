/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("user", (table) =>{
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").notNullable();
        table.string("team").notNullable();
        



    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("user");
  
};
