const express = require("express");
const router = express.Router();
const db = require("../db/db");
const multer = require('multer');
const path = require('path');
const config = require("../../config");
var midway = require('./midway');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const { equal } = require("assert");
const { Console } = require("console");
const { json } = require("body-parser");
const nodemailer = require('nodemailer');
// const today = new Date();
// const utcMonth = today.getUTCMonth();


router.get("/GetAllMandalTypeList", (req, res, next) => {
    db.executeSql("SELECT DISTINCT mandaltype from mandal", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});
router.get("/GetMandalList/:type", (req, res, next) => {
    db.executeSql("select * from mandal where mandaltype='" + req.params.type + "'", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});
router.get("/GetAllMandalList", (req, res, next) => {
    db.executeSql("select * from mandal ;", function(data, err) {
        if (err) {
            console.log(err);
        } else {
             res.json(data);
        }
    })
});
router.get("/GetAllRelationList", (req, res, next) => {
    db.executeSql("select * from relation", function(data, err) {
        if (err) {
            console.log(err);
        } else {
             res.json(data);
        }
    })
});
router.get("/getAllFamilyList", (req, res, next) => {
    db.executeSql("select * from family", function(data, err) {
        if (err) {
            console.log(err);
        } else {
             res.json(data);
        }
    })
});


router.post("/createFamily",(req,res,next)=>{
    db.executeSql("INSERT INTO `family`( `mobNo`, `noOfFamilyMem`) VALUES ('"+req.body.mob+"',"+req.body.nooffammem+")", function(data, err) {
        if (err) {
            console.log(err);
        } else {
             res.json(data);
        }
    })
});
router.post("/getOldDetails",(req,res,next)=>{
    db.executeSql("select * from family where mobNo="+req.body.mob, function(data, err) {
        if (err) {
            console.log(err);
        } else {
            if(data.length>0){
                db.executeSql("select bi.userId,bi.firstName,bi.middleName,bi.lastName,bi.relationship,bi.mandaltype,bi.mandalName,bi.mandalId,bi.contactNo,bi.familyId,ds.status from basicInfo bi join draftstaus ds on bi.userId=ds.userId where bi.familyId="+data[0].familyId,function(data1,err){
                    if(err){
                        console.log(err)
                        res.json('err')
                    }else{
                        res.json(data1)
                    }
                })
            }else{
                res.json('no family')
            }
            
        }
    })
})


router.post("/SaveMemberList", (req, res, next) => {
    console.log(req.body);
    db.executeSql("SELECT * FROM `basicinfo` where contactNo='" + req.body[0].contactNo + "'", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            if (data.length > 0) {
                console.log("im hereee")
                let test=[];
                data[0].isDuplicate = true;
                data[0].status=1;
                res.json(data);
            } else {
                for (let i = 0; i < req.body.length; i++) {
                    let test = [];
                    db.executeSql("INSERT INTO `basicinfo` (`firstName`, `middleName`, `lastName`, `relationship`, `mandaltype`, `mandalName`, `mandalId`, `contactNo`, `familyId`) VALUES ('" +
                        req.body[i].firstName + "','" + req.body[i].middleName + "','" + req.body[i].lastName + "','" + req.body[i].relationship + "','" + req.body[i].mandaltype + "','" + req.body[i].mandalName + "'," + req.body[i].mandalId + ",'" + req.body[i].contactNo + "',"+req.body[i].familyId + ")",
                        function(data, err) {
                            if (err) {
                                console.log(err);
                            } else {
                                db.executeSql("INSERT INTO `draftstaus`( `userId`, `status`) VALUES (" + data.insertId + "," + 1 + ")", function(data1, err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        let a = {
                                            id: data.insertId,
                                            status: 1
                                        };
                                        test.push(a);
                                        console.log(test);
                                        if (i == req.body.length - 1) {
                                            console.log("im here");
                                            res.json(test);
                                        }
                                    }
                                });
                            }
                        })


                }

            }
        }
    })
});

router.post("/SaveProffesionInfo", (req, res, next) => {
    console.log('profession')
    console.log(req.body);

                for (let i = 0; i < req.body.length; i++) {
                    let test = [];
                    db.executeSql("INSERT INTO `proffesioinfo`( `userId`, `address`, `pincode`, `skill`, `profession`, `education`, `occupation`, `businessType`, `workInfo`) VALUES (" +
                        req.body[i].userId + ",'" + req.body[i].address + "','" + req.body[i].pincode + "','" + req.body[i].skills + "','" + req.body[i].profession + "','" + req.body[i].education + "','" + req.body[i].occupation + "','" + req.body[i].businessType + "','"+ req.body.workInfo+ "')",
                        function(data, err) {
                            if (err) {
                                console.log(err);
                            } else {
                                db.executeSql("update draftstaus set status=2 where userId="+req.body[i].userId, function(data1, err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        let a = {
                                            status: 2
                                        };
                                        test.push(a);
                                        console.log(test);
                                        if (i == req.body.length - 1) {
                                            console.log("im here");
                                            res.json(test);
                                        }
                                    }
                                });
                            }
                        })
                }
});

router.get("/getRedtickCount", (req, res, next) => {
    db.executeSql("select * from `draftstaus` where status=1", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/getYellowtickCount", (req, res, next) => {
    db.executeSql("select * from `draftstaus` where status=2", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/getGreentickCount", (req, res, next) => {
    db.executeSql("select * from `draftstaus` where status=3", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/getAllSavedMembersList", (req, res, next) => {
    db.executeSql("select * from `basicinfo`", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});


router.get("/getAllHaribhakt", (req, res, next) => {
        db.executeSql("select * from  basicinfo ;", function(data, err) {
            if (err) {
                console.log("Error in store.js", err);
            } else {
                return res.json(data);
            }
        });
    })
    // let secret = 'prnv';

let secret = 'prnv';
router.post('/GetUsersLogin', function(req, res, next) {
    // restart1();
    const body = req.body;
    console.log(body, 'Main Email');
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("select * from admin where email='" + req.body.email + "';", function(data, err) {
        if (data == null || data == undefined) {
            return res.json(1);
        } else {
            db.executeSql("select * from admin where email='" + req.body.email + "' and password='"+encPassword+"';", function(data, err) {

                if (data == null || data == undefined) {
        
                    return res.json(2);
                } else {
                    data[0].role='admin';
                    res.json(data);
                }
            });
        }
    });

});




function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}


module.exports = router;