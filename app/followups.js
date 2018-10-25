var express = require('express');
var moment = require('moment');
var router = express.Router();
var followup = require('./models/followup');
var ObjectId = require('mongodb').ObjectID;

router.get('/fetchAll', function(req, res){
    var allFollowUps = followup.find({},{}).exec(function(error, allFollowUps){
        if(!error && allFollowUps){
           
            var allFollowUps = allFollowUps.map(obj =>{ 
               var rObj = {
                   name: obj.name,
                   phone: obj.phone,
                   email: obj.email,
                   type: obj.type,
                   comment: obj.comment,
                   nextFollowAt: moment(new Date(obj.nextFollowAt)).format("DD-MMM-YYYY"),
                   _id: obj._id,
                   _created: moment(new Date(obj._created)).format("DD-MMM-YYYY"),
                   complete: obj.complete,
                   referredBy: obj.referredBy,
                   relatedTo: obj.relatedTo
               };
               return rObj;
            });
            //console.log(allFollowUps);
            var finalArray = [];
            var returnObj = {}; 
            var treeArray = []; 
            var treeObj = {}; 
            
            allFollowUps = allFollowUps.sort(function(a, b){
                return a.referredBy.length - b.referredBy.length;    
            });
            
            /*var allNodes = [];
            allFollowUps.forEach(function(thisFollowUp, fIndex){
                var node = {
                    _id: thisFollowUp._id,
                    info: thisFollowUp,
                    children: []
                };
                allNodes.push(node);
            });
            allFollowUps.forEach(function(thisFollowUp, fIndex){
                var thisReferredBy = thisFollowUp.referredBy;
                allNodes.forEach(function(thisNode, nIndex){
                    if(thisReferredBy.indexOf(thisNode._id) != -1){
                        var indexinallNodes = allNodes.findIndex(o => o._id == thisFollowUp._id)
                        thisNode.children.push(allNodes[indexinallNodes]);
                    }
                })
            })
            console.log(allNodes);*/
            
            /*allFollowUps.forEach(function(thisFollowUp, fIndex){
                var thisReferredBy = thisFollowUp.referredBy;
                var thisName = thisFollowUp.name;
                var tDepth = thisReferredBy.length;
                if(tDepth == 0){
                    treeObj[thisFollowUp._id] = thisFollowUp;
                }else{
                    var lastElement = treeObj;
                    thisReferredBy.forEach(function(thisTreeNode, nIndex){
                        lastElement = lastElement[thisTreeNode];
                        
                        if(nIndex == thisReferredBy.length - 1){
                            //console.log(lastElement);
                            lastElement[thisFollowUp._id] = thisFollowUp;
                        }
                    });
                }
               
            });
            console.log(treeObj);
            var finalArr = Object.values(treeObj);
            console.log(finalArr);
            finalArr.forEach(function(thisValue, vIndex){
                console.log(thisValue);
            })*/
            /*allFollowUps.forEach(function(thisFollowUp, fIndex){
                var thisReferredBy = thisFollowUp.referredBy;
                var thisName = thisFollowUp.name;
                var tDepth = thisReferredBy.length;
                if(tDepth == 0){
                    var newObj = {
                        _id: thisFollowUp._id,
                        _info: thisFollowUp,
                        _children: []
                    };
                    treeArray.push(newObj);
                }else{
                    //thisReferredBy
                    
                    var lookAtArray = [];
                    var indexesArray = [];
                    lookAtArray = treeArray;
                    thisReferredBy.forEach(function(thisTreeNode, nIndex){
                        
                        var treeArrayIds = [];
                        if(lookAtArray.length > 0){
                            treeArrayIds = lookAtArray.map(obj =>{return obj._id.toString();});
                        }
                        var thisTreeIndex = treeArrayIds.indexOf(thisTreeNode.toString());
                        
                        //console.log(treeArrayIds);
                        console.log(thisName + " | " +  thisTreeNode + " | " + thisTreeIndex);
                        
                        if(thisTreeIndex != -1){
                            indexesArray.push(thisTreeIndex);
                            lookAtArray = lookAtArray[thisTreeIndex]._children;
                        }else{
                            console.log("World not making sense!!");
                        }
                        if(nIndex < thisReferredBy.length - 1){
                            //Nothing to do
                        }else if(nIndex == thisReferredBy.length - 1){
                            var finalNode = {};
                            indexesArray.forEach(function(thisIndex, dtIndex){
                                
                                if(thisIndex == indexesArray.length - 1){
                                    //reached the last
                                    
                                }else{
                                    if(treeArray[thisIndex]){

                                    }
                                }
                                
                                
                                
                            });
                            
                            
                            lookAtArray.push(thisFollowUp);
                            console.log(indexesArray);
                            console.log("-------");
                        }
                        
                        
                    });
                    
                    
                    
                }
               
            });*/
            
            //console.log(treeArray);
            
           allFollowUps.forEach(function(thisFollowUp, fIndex){
               var thisReferredBy = thisFollowUp.referredBy;
               
                returnObj[thisFollowUp._id.toString()] = [];
                returnObj[thisFollowUp._id.toString()].push(thisFollowUp);
               
               if(thisReferredBy.length > 0){
                   returnObj[thisReferredBy[thisReferredBy.length - 1].toString()].push(thisFollowUp);
               }
               
            });
            //console.log(returnObj);
            //console.log(returnObj);
            finalArray = Object.values(returnObj);
            res.json(finalArray);
        }
    })
})

router.get('/query/:queryString', function(req, res)   {
    
    var queryString = req.params.queryString;
    
    var allFollowUps = followup
    .find({name: {'$regex': queryString, '$options' : 'i'} }, {})
    .exec(function (err, allFollowUps) {
        if (!err && allFollowUps){
            res.json(allFollowUps);
        }else{
            res.json([]);
        }
    });
});

router.post('/newFollowUp', function(req, res){
    
    console.log(req.body);
    console.log("---------");
    var reqForm = req.body;
    //var newfollow = req.body;
    var newfollow = {
        type: reqForm.type,
        name: reqForm.name,
        phone: reqForm.phone,
        email: reqForm.email,
        nextFollowAt: moment(new Date(reqForm.nextFollowAt)).utc(),
        comment: reqForm.comment,
        complete: reqForm.complete,
        referredBy: []
    };
    
    if(reqForm.referredBy){
        
        var thisFollowUp = followup
        .findOne({ _id: reqForm.referredBy }, {referredBy: 1})
        .exec(function (err, thisFollowUp) {
            //console.log(thisFollowUp);
            //console.log("---------");
            if (!err && thisFollowUp){
                
                
                var thisReferred = thisFollowUp.referredBy;
                if(!thisReferred){
                    thisReferred = [];
                }
                /*console.log(thisReferred);
                console.log("A---------");
                console.log(thisFollowUp._id);
                console.log("B---------");*/
                thisReferred.push(thisFollowUp._id);
                newfollow.referredBy = thisReferred;
                
                //console.log(newfollow.referredBy);
                /*console.log(newfollow);
                console.log("C---------");*/
                
                var newFollowUp = new followup(newfollow);
                newFollowUp.save(function(error){
                    if(error){
                        console.log("Error: " + error);
                        res.json(null);
                    }else{
                        console.log("Added new entry: " + newFollowUp);
                        res.json(newFollowUp);
                    }
                });
                
            }else{
                var newFollowUp = new followup(newfollow);
                newFollowUp.save(function(error){
                    if(error){
                        console.log("Error: " + error);
                        res.json(null);
                    }else{
                        console.log("Added new entry: " + newFollowUp);
                        res.json(newFollowUp);
                    }
                });
            }
        });
        
        
    }else{
        newfollow.referredBy = [];
        var newFollowUp = new followup(newfollow);
        newFollowUp.save(function(error){
            if(error){
                console.log("Error: " + error);
                res.json(null);
            }else{
                console.log("Added new entry: " + newFollowUp);
                res.json(newFollowUp);
            }
        });
    }
    
    
    
})

router.post('/updateFollowUp', function(req, res){
    console.log(req.body);
    var reqForm = req.body;
    var _id = reqForm._id;
    var nextFollowAt = reqForm.nextFollowAt;
    var complete = reqForm.complete;
    
    var toUpdateFollowUp = followup.findOne({_id: _id},{}).exec(function(error, toUpdateFollowUp){
        if(!error && toUpdateFollowUp){
            toUpdateFollowUp.nextFollowAt = nextFollowAt;
            toUpdateFollowUp.complete = complete;
            toUpdateFollowUp.save(function(error){
                if(error){
                    console.log("Error: " + error);
                    res.json(null);
                }else{
                    console.log("Updated entry: " + toUpdateFollowUp);
                    res.json(toUpdateFollowUp);
                }
            });
        }else{
            console.log("Error: " + error);
            res.json([]);
        }
    })
})

module.exports = router;