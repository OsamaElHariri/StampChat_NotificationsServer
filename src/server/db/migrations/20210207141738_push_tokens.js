
exports.up = function (knex) {
    return knex.schema.createTable('tokens', (table) => {
        table.increments();
        table.timestamp('inserted_at').defaultTo(knex.fn.now())
        table.string('identity').notNullable();
        table.string('fcm_token').notNullable();

    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('tokens');
};
