var express = require('express');
var app = express();

const path = require('path');
const publicPath = path.join(__dirname, '/../app');
const fs = require('fs')
const hls = require('hls-server');

app.use("/", express.static('./'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/app/index.html'))
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

new hls(app, {
    provider: {
        exists: (req, cb) => {
            const ext = req.url.split('.').pop();

            if (ext !== 'm3u8' && ext !== 'ts') {
                return cb(null, true);
            }

            fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
                if (err) {
                    console.log('File not exist');
                    return cb(null, false);
                }
                cb(null, true);
            });
        },
        getManifestStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        },
        getSegmentStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        }
    }
});