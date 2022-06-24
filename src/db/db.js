var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "baps"
});
exports.executeSql = function(sql, callback) {
    con.query(sql, function(err, result) {
        if (err) {
            // throw err;
            console.log(err);
            callback(null, err);
        } else {
            console.log(result)
            callback(result);
        }

    });

}