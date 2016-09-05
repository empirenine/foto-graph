/**
 * Created by user on 9/4/2016.
 */
var express = require('express');
var router = express.Router();
var imageFile = require('../controllers/imageFile');

/* GET base route page. */
router.get('/', function(req, res, next) {
    var options = {
        layout: "layout2",
        title: 'Foto-Graph Assets'
    };
    res.render('assets', options);
});


router.post('/read-local/:filename', function(req, res, next){
    req.params.filename = "C:/Users/user/s5-image-recovery/[000181].jpg";

    var fileProcessResult;
    if (!req.params.filename){
        fileProcessResult = imageFile.dummyFail("failed because you didn't provide a real filename");
    }
    var meta = {tags:["Evan","Leah", "Family", "Zoo"]};
    fileProcessResult = imageFile.processFile(req.params.filename, meta);

    fileProcessResult
        .then(function(result){
            res.render('assets', result);
        })
        .catch(function(error){
            res.render('error', {message: error.message, error:error});
        })
        .done();
});

module.exports = router;
