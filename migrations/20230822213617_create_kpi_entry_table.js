/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("kpi_entry", (table)=>{
        table.increments("id").primary();
        table.integer("kpi_id").unsigned().notNullable();
        table.decimal("value").notNullable();
        table.integer("created_by").unsigned().notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.string("observation",500);
        table.foreign("created_by").references("id").inTable("user");
        table.foreign("kpi_id").references("id").inTable("kpi");

        
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("kpi_entry");
  
};
