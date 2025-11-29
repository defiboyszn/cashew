import {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("accounts", (table) => {
        table.increments("id").primary();
        table.string("address", 100).notNullable().unique();
        table.json("enabledTokens").notNullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.timestamp("updatedAt").defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("accounts")
}
