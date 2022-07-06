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
    db.executeSql("SELECT DISTINCT mandaltype from mandal", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});
router.get("/GetMandalList/:type", (req, res, next) => {
    db.executeSql("select * from mandal where mandaltype='" + req.params.type + "'", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/savePersonalInfo", (req, res, next) => {
    console.log(req.body);
    for (let i = 0; i < req.body.length; i++) {
        db.executeSql("select * from personalinfo where familyId="+req.body[i].familyId+" and contactNo='"+req.body[i].contactNo+"';",function(data,err){
            if(err){
                
                    res.json('err')
                
            }else{
                if(data.length>0){
                        data[0].msg='added';
                        res.json(data)
                    
                }else{
                    db.executeSql("INSERT INTO `personalinfo`( `familyId`, `firstName`, `middleName`, `lastName`, `contactNo`, `mandalType`, `mandalName`, `mandalId`, `relationship`, `address`, `city`, `pincode`, `email`, `gender`, `bloodGrp`, `dob`, `maritalStatus`, `profession`, `status`, `occupation`, `businessType`, `workInfo`, `isForeignCountry`, `foreignCountry`, `foreignCity`, `foreignContact`, `tag`, `education`, `prepareIelts`,`skill`) VALUES (" + req.body[i].familyId + ",'" + req.body[i].firstName + "','" + req.body[i].middleName + "','" + req.body[i].lastName + "','" + req.body[i].contactNo + "','" + req.body[i].mandalType + "','" + req.body[i].mandalName + "'," + req.body[i].mandalId + ",'" + req.body[i].relationship + "','" + req.body[i].address + "','" + req.body[i].city + "','" + req.body[i].pincode + "','" + req.body[i].email + "','" + req.body[i].gender + "','" + req.body[i].bloodGrp + "','" + req.body[i].dob + "','" + req.body[i].maritalStatus + "','" + req.body[i].profession + "','" + req.body[i].status + "','" + req.body[i].occupation + "','" + req.body[i].businessType + "','" + req.body[i].workInfo + "'," + req.body[i].isForeignCountry + ",'" + req.body[i].foreignCountry + "','" + req.body[i].foreignCity + "','" + req.body[i].foreignContact + "','" + req.body[i].tag + "','" + req.body[i].education + "'," + req.body[i].prepareIelts + ",'" + req.body[i].skill + "')", function (data1, err) {
                        if (err) {
                            res.json('err')
                        } else {
                            res.json(data1)
                        }
                        
                    })
                }
            }
        })


  
    }
})

router.post("/updatePersonalInfo", (req, res, next) => {
    console.log(req.body);
        db.executeSql("delete from personalinfo where userId="+req.body[0].userId,function(data,err){
            if(err){
                res.json(err)
            }else{
                for (let i = 0; i < req.body.length; i++) {
                    db.executeSql("INSERT INTO `personalinfo`( `familyId`, `firstName`, `middleName`, `lastName`, `contactNo`, `mandalType`, `mandalName`, `mandalId`, `relationship`, `address`, `city`, `pincode`, `email`, `gender`, `bloodGrp`, `dob`, `maritalStatus`, `profession`, `status`, `occupation`, `businessType`, `workInfo`, `isForeignCountry`, `foreignCountry`, `foreignCity`, `foreignContact`, `tag`, `education`, `prepareIelts`,`skill`) VALUES (" + req.body[i].familyId + ",'" + req.body[i].firstName + "','" + req.body[i].middleName + "','" + req.body[i].lastName + "','" + req.body[i].contactNo + "','" + req.body[i].mandalType + "','" + req.body[i].mandalName + "'," + req.body[i].mandalId + ",'" + req.body[i].relationship + "','" + req.body[i].address + "','" + req.body[i].city + "','" + req.body[i].pincode + "','" + req.body[i].email + "','" + req.body[i].gender + "','" + req.body[i].bloodGrp + "','" + req.body[i].dob + "','" + req.body[i].maritalStatus + "','" + req.body[i].profession + "','" + req.body[i].status + "','" + req.body[i].occupation + "','" + req.body[i].businessType + "','" + req.body[i].workInfo + "'," + req.body[i].isForeignCountry + ",'" + req.body[i].foreignCountry + "','" + req.body[i].foreignCity + "','" + req.body[i].foreignContact + "','" + req.body[i].tag + "','" + req.body[i].education + "'," + req.body[i].prepareIelts + ",'" + req.body[i].skill + "')", function (data, err) {
                        if (err) {
                            console.log(err);
                            res.json(err)
                        } else {}
                        if (i - (req.body.length - 1)) {
                            res.json('success')
                        }
                    })
                }
            }

        })





       
    
})

router.get("/GetAllMandalList", (req, res, next) => {
    db.executeSql("select * from mandal ;", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    })
});
router.get("/GetAllRelationList", (req, res, next) => {
    db.executeSql("select * from relation", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    })
});

router.get("/getAllFamilyForData", (req, res, next) => {
    console.log('sjhuishxjhsjixhijshxui')
    db.executeSql("select f.familyId,f.mobNo,f.noOfFamilyMem,e.userId,e.firstName,e.middlename,e.lastName,e.relationship,e.mandalType,e.mandalName,e.mandalId from family f left join personalinfo e on f.mobNo=e.contactNo and f.familyId=e.familyId", function (data, err) {
        if (err) {
            console.log(err);
            res.json(err)
        } else {
            res.json(data);
        }
    })
})



router.post("/createFamily", (req, res, next) => {
    db.executeSql("select * from family where mobNo="+req.body.mob,function(data,err){
        if(err){
            res.json(err)
        }else{
            if(data.length>0){
                res.json(data)
            }else{
                db.executeSql("INSERT INTO `family`( `mobNo`, `noOfFamilyMem`) VALUES ('" + req.body.mob + "'," + req.body.nooffammem + ")", function (data, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(data);
                    }
                })
            }
        }
    })
    
});
router.post("/updateHaribhakt", (req, res, next) => {
    console.log(req.body);
    if (req.body.status == 1) {
        db.executeSql("delete from basicinfo where userId=" + req.body.userId, function (data, err) {
            if (err) {
                res.json(err)
            } else {

            }
        })
    }
})
router.post("/getOldDetails", (req, res, next) => {
    db.executeSql("select * from family where mobNo=" + req.body.mob, function (data, err) {
        if (err) {
            console.log(err);
        } else if (data.length > 0) {
            db.executeSql("select * from personalinfo where familyId=" + data[0].familyId, function (data1, err) {
                if (err) {
                    console.log(err)
                    res.json('err')
                } else {
                    res.json(data1)
                }
            })
        }
        else {
            db.executeSql("select * from personalinfo where contactNo=" + req.body.mob, function (data2, err) {
                if(err){
                    res.json(err)
                }else{
                    if (data2.length > 0) {
                        db.executeSql("select * from personalinfo where familyId=" + data2[0].familyId, function (data3, err) {
                            if (err) {
                                console.log(err)
                                res.json('err')
                            } else {
                                res.json(data3)
                            }
                        })
                    } else {
                        res.json('no family');
                    }
                }
                

            })
        }
    })
})


router.post("/SaveMemberList", (req, res, next) => {
    db.executeSql("SELECT * FROM `basicinfo` where contactNo='" + req.body[0].contactNo + "'", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            if (data.length > 0) {
                console.log("im hereee")
                let test = [];
                data[0].isDuplicate = true;
                data[0].status = 1;
                res.json(data);
            } else {
                for (let i = 0; i < req.body.length; i++) {
                    let test = [];
                    db.executeSql("INSERT INTO `basicinfo` (`firstName`, `middleName`, `lastName`, `relationship`, `mandaltype`, `mandalName`, `mandalId`, `contactNo`, `familyId`) VALUES ('" +
                        req.body[i].firstName + "','" + req.body[i].middleName + "','" + req.body[i].lastName + "','" + req.body[i].relationship + "','" + req.body[i].mandaltype + "','" + req.body[i].mandalName + "'," + req.body[i].mandalId + ",'" + req.body[i].contactNo + "'," + req.body[i].familyId + ")",
                        function (data, err) {
                            if (err) {
                                console.log(err);
                            } else {
                                db.executeSql("INSERT INTO `draftstaus`( `userId`, `status`) VALUES (" + data.insertId + "," + 1 + ")", function (data1, err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        let a = {
                                            id: data.insertId,
                                            status: 1
                                        };
                                        test.push(a);
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

router.post("/verifyNumber", (req, res, next) => {
    db.executeSql("select * from personalinfo where contactNo=" + req.body.mob, function (data, err) {
        if (err) {
            res.json(err)
        } else {
            res.json(data)
        }
    })
})

router.post("/SaveProffesionInfo", (req, res, next) => {
    console.log(req.body);
    for (let i = 0; i < req.body.length; i++) {
        let test = [];
        db.executeSql("INSERT INTO `proffesioinfo`( `userId`, `address`, `pincode`, `skill`, `profession`, `education`, `occupation`, `businessType`, `workInfo`,`city`) VALUES (" +
            req.body[i].userId + ",'" + req.body[i].address + "','" + req.body[i].pincode + "','" + req.body[i].skills + "','" + req.body[i].profession + "','" + req.body[i].education + "','" + req.body[i].occupation + "','" + req.body[i].businessType + "','" + req.body[i].workInfo + "','" + req.body[i].city + "')",
            function (data, err) {
                if (err) {
                    console.log(err);
                } else {
                    db.executeSql("update draftstaus set status=2 where userId=" + req.body[i].userId, function (data1, err) {
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
    db.executeSql("select bi.userId,bi.firstName,bi.middleName,bi.lastName,bi.relationship,bi.mandaltype,bi.mandalName,bi.mandalId,bi.contactNo,bi.familyId,ds.status from basicInfo bi join draftstaus ds on bi.userId=ds.userId where ds.status=1", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/getEditDataforSecondStage", (req, res, next) => {
    db.executeSql("select bi.userId,bi.firstName,bi.middleName,bi.lastName,bi.relationship,bi.mandaltype,bi.mandalName,bi.mandalId,bi.contactNo,bi.familyId,pi.proffesionId,pi.address,pi.pincode,pi.skill,pi.profession,pi.education,pi.occupation,pi.businessType,pi.workInfo from basicinfo bi join proffesioinfo pi on bi.userId=pi.userId where bi.userId=" + req.body.userId, function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});
router.post("/SaveMandalList", (req, res, next) => {
    db.executeSql("INSERT INTO `mandal`(`name`, `mandaltype`) VALUES ('" + req.body.name + "','" + req.body.mandaltype + "');", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/getAllFamilyList", (req, res, next) => {
    db.executeSql("select f.familyId,f.mobNo,f.noOfFamilyMem,bi.userId,bi.firstName,bi.middleName,bi.lastName,bi.relationship,bi.mandaltype,bi.mandalName,bi.mandalId,bi.contactNo from family f join basicInfo bi on f.mobNo=bi.contactNo", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    })
});

router.get("/getYellowtickCount", (req, res, next) => {
    db.executeSql("select bi.userId,bi.firstName,bi.middleName,bi.lastName,bi.relationship,bi.mandaltype,bi.mandalName,bi.mandalId,bi.contactNo,bi.familyId,ds.status from basicInfo bi join draftstaus ds on bi.userId=ds.userId where ds.status=2", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/getGreentickCount", (req, res, next) => {
    db.executeSql("select bi.userId,bi.firstName,bi.middleName,bi.lastName,bi.relationship,bi.mandaltype,bi.mandalName,bi.mandalId,bi.contactNo,bi.familyId,ds.status from basicInfo bi join draftstaus ds on bi.userId=ds.userId where ds.status=3", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/getAllSavedMembersList", (req, res, next) => {
    db.executeSql("select * from `basicinfo`", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/RemoveHaribhaktDetails/:id", (req, res, next) => {
    db.executeSql("Delete from basicinfo where userId=" + req.params.id, function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    });
})

router.get("/RemoveMandalDetails/:id", (req, res, next) => {
    db.executeSql("Delete from mandal where id=" + req.params.id, function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/UpdateMandalList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("UPDATE `mandal` SET name='" + req.body.name + "',mandaltype='" + req.body.mandaltype + "' where id=" + req.body.id + ";", function (data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})
router.get("/getAllHaribhakt", (req, res, next) => {
    db.executeSql("select * from  personalinfo ;", function (data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/addFamilytoNew", (req, res, next) => {
    console.log('here im')
    db.executeSql("select * from  family where familyId="+req.body.oldFamilyId, function (data, err) {
       
        if (err) {
            console.log(err)
            console.log("Error in store.js", err);
        } else {
           db.executeSql("select * from personalinfo where familyId="+data[0].familyId+" and relationship='Father'",function(data1,err){
            console.log('err')    
            if(err){
                    console.log(err)
                    res.json(err)
                }else{
                    if(data1.length>0){
                        db.executeSql("update personalinfo set familyId="+data[0].familyId+" where familyId="+req.body.familyId,function(data2,err){
                            if(err){
                                console.log(err)
                                res.json(err)
                            }else{
                                console.log("updated");
                                deleteFamily(req.body.familyId)
                                res.json(data1);
                            }
                        })
                    }else{
                        res.json(data1);
                    }
                   
                }
           })
        }
    });
})
function deleteFamily(id){
    console.log('im hererererere')
    db.executeSql("delete from family where familyId="+id,function(data,err){
        if(err){
            console.log(err)
        }else{
            console.log(data)
        }
    })
};
router.post("/vetifyNumber", (req, res, next) => {
    db.executeSql("select * from  personalinfo where contactNo="+req.body.mob, function (data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else if(data.length >0) {
           db.executeSql("select * from personalinfo where familyId="+data[0].familyId,function(data1,err){
            if(err){
                res.json(err)
            }else{
                
                if(data1.length>0){
                    res.json(data1)
                }else{
                    res.json(data)
                }
            }
           })
        }else{
            res.json('noFamily');
        }
    });
})
// let secret = 'prnv';

let secret = 'prnv';
router.post('/GetUsersLogin', function (req, res, next) {
    // restart1();
    const body = req.body;
    console.log(body, 'Main Email');
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("select * from admin where email='" + req.body.email + "';", function (data, err) {
        if (data == null || data == undefined) {
            return res.json(1);
        } else {
            db.executeSql("select * from admin where email='" + req.body.email + "' and password='" + encPassword + "';", function (data, err) {

                if (data == null || data == undefined) {

                    return res.json(2);
                } else {
                    data[0].role = 'admin';
                    res.json(data);
                }
            });
        }
    });

});




function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}


module.exports = router;