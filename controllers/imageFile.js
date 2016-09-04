var Q = require('q');
var fs = require('fs');
var b2 = require('backblaze-b2');
var structr = require('structr-4-tasks');

function _parseExif(file){

}

function _hashFile(file){

}

function _backup(file){

}

function _setMetadata(){
    return _checkIndex(function(isNew){
        if(!isNew){
            __createMetadata();
        }
        else{
            __updateMetadata();
        }
    });
}

function _checkIndex(){

}

function __createMetadata(){

}

function __updateMetadata(){

}

function _processFile(file, metadata){
    var hash, exif;

    return _hashFile()
        .then(function(hash){
            return _parseExif();
        })
        .then(function(exif){
            return _setMetadata();
        })
        .then(function(){
            _backup();
        });
}


var imageFileCtlr = {
    processFile: _processFile
};

module.exports =imageFileCtlr;