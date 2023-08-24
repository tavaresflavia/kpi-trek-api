/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("comment", (table) => {
        table.increments("id").primary();
        table.integer("request_id").unsigned().notNullable();
        table.integer("created_by").unsigned().notNullable();
        table.string("content", 500).notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.foreign("request_id").references("id").inTable("request");
        table.foreign("created_by").references("id").inTable("user").onUpdate("CASCADE");

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("comment");
};
