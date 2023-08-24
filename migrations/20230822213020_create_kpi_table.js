/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable("kpi", (table) =>{
            table.increments("id").primary();
            table.integer("created_by").unsigned().notNullable();
            table.string("title").notNullable();
            table.string("description",500).notNullable();
            table.decimal("target");
            table.decimal("upper_limit");
            table.decimal("lower_limit");
            table.string("unit");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.foreign("created_by")
            .references("id")
            .inTable("user")
            .onUpdate("CASCADE");

        })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("kpi");
  
};
