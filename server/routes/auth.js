var express = require('express');
var router = express.Router();
const config = require('./authConfig.json');
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(config.clientId)
const User = require('../schematics/User');

router.post('/', async function (req, res, next) {
    const { token } = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.clientId
    });
    const { name, email, picture } = ticket.getPayload();
    const user = {
        email: email,
        name: name,
        picture: picture,
        authorized: config.authorizedUsers.includes(email)
    }
    User.updateOne({ email: email }, user, { upsert: true }, async function (err, record) {
        if (err) console.log(err);
        if (record.nModified > 0) {
            const updatedDoc = await this.User.findOne(this.getQuery());
            console.log(updatedDoc._id);
            req.session.userId = updatedDoc._id;
        }
    });
    res.status(201)
    res.json(user)
});

module.exports = router;
