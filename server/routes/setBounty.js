var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/', function (req, res, next) {
    if (Object.keys(req.body).length > 0) {
        fs.readFile(path.join(__dirname, `./../convertor/details/bounty.json`), { encoding: "utf-8" }, (err, json) => {
            if (err) {
                res.status(400);
            }
            let shallowCopy = JSON.parse(json);
            for (let i in req.body) {
                shallowCopy[i] = req.body[i];
            }
            res.status(200);
            fs.writeFile(path.join(__dirname, `./../convertor/details/bounty.json`), JSON.stringify(shallowCopy), "utf-8", err => {
                if (err) {
                    res.status(500)
                }
            })
            res.send('Does this signal you frontend?');
        });
    } else {
        res.status(400);
    }
});

module.exports = router;
