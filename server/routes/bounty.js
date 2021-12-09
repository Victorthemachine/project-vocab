var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/', function (req, res, next) {
    fs.readFile(path.join(__dirname, `./../convertor/details/bounty.json`), (err, json) => {
        if (err) {
            res.status(400);
        }
        res.send(json);
    });
});

module.exports = router;
