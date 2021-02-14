var tokenQueries = require('../server/db/queries/tokenQueries');


class NotificationService {
    async notify(admin, { identities, data, notification }) {
        console.log(identities);
        if (!identities || identities.length == 0) return {};
        data = data || {};
        data.click_action = "FLUTTER_NOTIFICATION_CLICK";
        try {

            const tokens = await tokenQueries.getTokensForUsers(identities);


            const notificationTokens = tokens.map(token => token.fcm_token);

            const pushMessage = {
                data: data,
                notification: notification,
                token: notificationTokens[0]
            };
            const result = await admin.messaging().send(pushMessage);
        } catch (error) {
            console.log(error);
        }

        return 1;
    }
}

module.exports = NotificationService;