/**
 * Created by user on 9/4/2016.
 */
var express = require('express');
var router = express.Router();

/* GET base route page. */
router.get('/', function(req, res, next) {
    res.render('index', { layout: "layout2",title: 'Foto-Graph Assets' });
});


router.post('/read-local/:filename', function(req, res, next){
    if (!req.params.filename){
        result = "fail"
    }
    var exif = require('exif-parser');
    fs = require('fs');

    fs.read()
    var templateData = {

    };
    res.render('asset-result', templateData)
});

module.exports = router;
