var Q = require('q');
var fs = require('fs');
var path = require('path');
var b2 = require('backblaze-b2');
var exif = require('exif-parser');
var md5File = require('md5-file');
var structr = require('structr-4-tasks');
var config = require('../config') //<-- this should also include loading credentials that will be used by the externals service (until there are user/account contexts)

function _parseExif(file, scanLength){
    //the exif tag should be at the beginning of the file.
    scanLength = scanLength || 65635;
    return Q.promise(function(resolvePromise, rejectPromise){
        try{
            var readBuffer = new Buffer(scanLength);
            fs.open(path.resolve(file),'r', function(err, fd){
                if(err){
                    rejectPromise(err);
                }
                else{
                    fs.read(fd, readBuffer, 0, scanLength, 0, function(err, data,thatBuffer){
                        if (err){
                            rejectPromise(err);
                        }
                        else{
                            exifParser = exif.create(thatBuffer);
                            var result = exifParser.parse();
                            console.log(JSON.stringify(result, null, "\t"));
                            resolvePromise(result);
                        }
                    });
                }
            });
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

function _backup(file, details){
    return Q.promise(function(resolvePromise, rejectPromise){
        try{
            resolvePromise(details.hash);
/*            b2.uploadFile(b2.createClient("xx", "xx"), function(err, data){
                if(err){
                    rejectPromise(err);
                }
                else{
                    resolvePromise(data);
                }
            });*/
        }
        catch(e){
            rejectPromise(e);
        }
    });
}

function _getFileMetadata(file, metadata){
    //todo replace with real file metadata - https://github.com/empirenine/foto-graph/issues/1
    if (metadata && metadata.file){
        return metadata.file;
    }
    //otherwise make something up and hand that back
    return {size:0, dateCreated:"", dateModified:""};
}

function _checkAssetIndex(hash){
    //force new file that we haven't found
    return false;
}


function _processFile(file, metadata){
    var fileDetails = {};
    try{
        return _hashFile(file)
            .then(function(hash){
                fileDetails.hash = hash;
                return _parseExif(file);
            })
            .then(function(exif){
                //attach the rest of the metadata
                fileDetails.exif = exif;
                fileDetails.userMetadata = metadata;
                fileDetails.sysMetadata = _getFileMetadata(file, metadata, exif);
                return fileDetails;
            })
            .then(function(details){
                //inform the next step whether we're going to upload or update?
                return _checkAssetIndex(details.hash);
            })
            .then(function(assetExists){
                if (assetExists){
                    return;
                }
                else{
                    //we're going to backup the file
                    return _backup(file, fileDetails);
                }
            })
            .then(function(result){
                if(result){
                    return fileDetails;
                }
                else{
                    return Q.reject(new Error("Unexpectedly got an empty result"));
                }
            })
            .catch(function(e){
                throw e;
            });
    }
    catch(e){
        var errCouldntProcessFile = new Error("the request to process the file could not be completed, see causeBy for more information");
        errCouldntProcessFile.causedBy = e;
        return Q.reject(errCouldntProcessFile);
    }
}


var imageFileCtlr = {
    processFile: _processFile,
    dummyFail: function(value){return Q.reject(new Error(value));}
};

module.exports =imageFileCtlr;