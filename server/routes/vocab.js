var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/', function (req, res, next) {
    const { lang } = req.body;
    if (lang) {
        fs.readFile(path.join(__dirname, `./../convertor/out/${lang}.json`), (err, json) => {
            if (err) {
                res.status(400);
                console.error(err);
            }
            res.send(json);
        });    
    } else {
        res.status(400);
    }
});

module.exports = router;
