var jwt = require('jsonwebtoken');
var tokenQueries = require('../server/db/queries/tokenQueries');

class RegistrationService {
    getTokenSecret() {
        return process.env.PRIVATE_KEY || "super_secret_key!";
    }

    async register(notificationToken, authToken) {
        const payload = jwt.decode(authToken);
        await tokenQueries.removeFcmToken(payload.identity);

        let token;
        [token] = await tokenQueries.addToken({
            identity: payload.identity,
            fcm_token: notificationToken,
        });

        return token;
    }

    async unregister(authToken) {
        const payload = jwt.decode(authToken);
        await tokenQueries.removeFcmToken(payload.identity);

        return true;
    }
}

module.exports = RegistrationService;