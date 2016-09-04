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

function _setMetadata(file, metadata){
    return _checkIndex(function(idIfExisting){
        if(idIfExisting &&  /[0-9a-fA-F]{32}/.test(idIfExisting)){
           //it already exists, we just want to update the metadata
            __updateMetadata();
        }
        else{
            //this is a new entry, we'll create the entity
            __createMetadata();
        }
    });
}

function _checkIndex(){
       structr.rest.find
}

function __createMetadata(){

}

function __updateMetadata(){

}

function _processFile(file, metadata){
    var hash, exif;

    return _hashFile(file)
        .then(function(hash){
            return _parseExif();
        })
        .then(function(exif){
            return _setMetadata(file, metadata);
        })
        .then(function(){              file
            _backup();
        });
}


var imageFileCtlr = {
    processFile: _processFile
};

module.exports =imageFileCtlr;