const knex = require('../connections');

function getToken(identity, tokenString) {
    return knex('tokens')
        .select('*')
        .where({
            fcm_token: tokenString,
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

function removeFcmToken(identity, tokenString) {
    return knex('tokens')
        .select('*')
        .where({
            fcm_token: tokenString,
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