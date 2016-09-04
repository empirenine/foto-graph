var Q = require('q');
var fs = require('fs');
var path = require('path');
var b2 = require('backblaze-b2');
var exif = require('exif-parser');
var md5File = require('md5-file');
var structr = require('structr-4-tasks');

function _parseExif(file, scanLength){
    //the exif tag should be at the beginning of the file.
    scanLength = scanLength || 16003;
    return Q.promise(function(resolvePromise, rejectPromise){
        try{
            exif.parseTags(fs.read(path.resolve(file),null,0,scanLength))
        }
        catch(e){
            rejectPromise(e);
        }
    });
}

function _hashFile(file){
    return Q.promise(function(resolvePromise, rejectPromise){
        try{
            return md5File(path.resolve(file), function(err, data){
                if(err){
                    rejectPromise(err);
                }
                else{
                    resolvePromise(data);
                }
            });
        }
        catch(e){
            rejectPromise(e);
        }
    });
}

function _backup(file){
    return Q.promise(function(resolvePromise, rejectPromise){
        try{
            b2.uploadFile(b2.createClient("xx", "xx"), function(err, data){
                if(err){
                    rejectPromise(err);
                }
                else{
                    resolvePromise(data);
                }
            });
        }
        catch(e){
            rejectPromise(e);
        }
    });
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