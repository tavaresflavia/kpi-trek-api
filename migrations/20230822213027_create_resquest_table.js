/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("request", (table) => {
    table.increments("id").primary();
    table.integer("created_by").unsigned().notNullable();
    table.integer("assigned_to").unsigned().notNullable();
    table.integer("kpi_id").unsigned().notNullable();
    table.string("title").notNullable();
    table.string("description", 500).notNullable();
    table.integer("rpn").unsigned().notNullable();
    table.integer("severity").unsigned().notNullable();
    table.integer("occurrence").unsigned().notNullable();
    table.integer("detection").unsigned().notNullable();
    table.string("request_status").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table
      .foreign("kpi_id")
      .references("id")
      .inTable("kpi")
      .onUpdate("CASCADE");
    table
      .foreign("created_by")
      .references("id")
      .inTable("user")
      .onUpdate("CASCADE");
    table
      .foreign("assigned_to")
      .references("id")
      .inTable("user")
      .onUpdate("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("request");
};
