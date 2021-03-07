const knex = require('../connections');

function getToken(identity) {
    return knex('tokens')
        .select('*')
        .where({
            identity: identity
        })
        .first();
}

function getTokensForUsers(identities) {
    return knex('tokens')
        .select('*')
        .whereIn('identity', identities);
}

function addToken(token) {
    return knex('tokens')
        .insert(token)
        .returning('*');
}

function removeFcmToken(identity) {
    return knex('tokens')
        .select('*')
        .where({
            identity: identity
        })
        .del();
}

module.exports = {
    getToken,
    getTokensForUsers,
    addToken,
    removeFcmToken,
};