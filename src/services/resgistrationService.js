var jwt = require('jsonwebtoken');
var tokenQueries = require('../server/db/queries/tokenQueries');

class RegistrationService {
    getTokenSecret() {
        return "super_secret_key!";
    }

    async register(notificationToken, authToken) {
        const payload = jwt.decode(authToken);
        let token = await tokenQueries.getToken(payload.identity, notificationToken);
        if (!token) {
            [token] = await tokenQueries.addToken({
                identity: payload.identity,
                fcm_token: notificationToken,
            });
        }

        return token;
    }

    async unregister(notificationToken, authToken) {
        const payload = jwt.decode(authToken);
        await tokenQueries.removeFcmToken(payload.identity, notificationToken);

        return true;
    }
}

module.exports = RegistrationService;