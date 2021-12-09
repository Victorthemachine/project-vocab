var express = require('express');
var router = express.Router();
const User = require('../schematics/User');
const config = require('./authConfig.json');

router.post('/', async function (req, res, next) {
    if (req.session && Object.keys(req.session).includes('userId')) {
        User.findById(req.session.userId)
            .then((err, record) => {
                if (err) {
                    console.log(error);
                    res.status(500);
                }
                if (record) {
                    res.status(200);
                    res.json({
                        name: record.name,
                        image: record.image,
                        email: record.email,
                        authorized: config.authorizedUsers.includes(record.email)
                    })
                } else {
                    res.status(401);
                }
            })
    } else {
        res.status(401);
    }
});

module.exports = router;
