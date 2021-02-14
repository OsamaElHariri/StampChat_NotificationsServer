const Koa = require('koa');
const logger = require('koa-morgan')
const Router = require('koa-router');
const bodyParser = require('koa-body')();
var jwt = require('koa-jwt');
const ResgistrationService = require('./services/resgistrationService');
const NotificationService = require('./services/notificationService');
var admin = require("firebase-admin");

var serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
} else {
    serviceAccount = require("../service_account.json");
}

const app = new Koa();

const routes = new Router()
const publicRoutes = new Router()

publicRoutes.get('/test', ctx => {
    ctx.body = {
        status: 'notifications ok'
    }
});

routes.post('/register', async ctx => {
    try {
        const authToken = ctx.get('Authorization').replace("Bearer ", "");
        const token = await (new ResgistrationService()).register(ctx.request.body.token, authToken);
        ctx.body = token;
    } catch (error) {
        ctx.throw(400, "Error registering token")
    }
})

routes.post('/unregister', async ctx => {
    try {
        const authToken = ctx.get('Authorization').replace("Bearer ", "");
        const token = await (new ResgistrationService()).unregister(ctx.request.body.token, authToken);
        ctx.body = token;
    } catch (error) {
        ctx.throw(400, "Error unregistering token")
    }
})

publicRoutes.post('/notify', async ctx => {
    try {
        console.log(ctx.request.body);
        ctx.body = {
            result: await (new NotificationService()).notify(ctx.firebaseAdmin, ctx.request.body)
        };
    } catch (error) {
        ctx.throw(400, "Error notifying users")
    }
})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app
    .use(async (ctx, next) => {
        ctx.firebaseAdmin = admin;
        await next();
    })
    .use(logger('tiny'))
    .use(bodyParser)
    .use(publicRoutes.routes())
    .use(jwt({ secret: (new ResgistrationService()).getTokenSecret() }))
    .use(routes.routes());

app.listen(process.env.PORT || 3001);