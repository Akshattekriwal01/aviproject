var express = require('express'),
    bodyParser = require('body-parser'),
    path = require("path"),
    request = require("request");
    mysql      = require('mysql');
    bodyparser = require('body-parser')

var app = express();
app.use(bodyparser.json());

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Domain123',
  database : 'draft1'
});

connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.query('SELECT * FROM student', function (error, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    console.log(result);
  });

// create application/json parser
app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//Set static path for ststic resources
app.use(express.static(path.join(__dirname, "public")));


app.get("/", function (req, res) {
    var courseList = [];
    request("https://api.umd.io/v0/courses/list", function (error, response, body) {

        if (!error) {
            var parsedData = JSON.parse(body);
            //adding each course to "courseList"
            parsedData.forEach(function (element) {
                courseList.push(element["course_id"]);
            });
            console.log(" 1 length of array is:" + courseList.length);
        }
        else
            console.log("some mannual error 1");

        var courseListString = "";
        var course = "AASP398Q,AASP398Z,AASP402,AASP441,AASP443,AASP478N,AASP498J";        
        
        //console.log("the course is " + course);

        courseList.forEach(x => {
            courseListString = courseListString + x + ",";
        });

        //console.log(courseListString);

        request("https://api.umd.io/v0/courses/"+course, function (error, response, body1) {
            console.log("connectiong with umd id sections");    
        // var parsedData1 = JSON.parse(body1);
            res.send(body1);
        });
    });

});


app.listen(3010, function () {
    console.log("server started at port 3000");
});
