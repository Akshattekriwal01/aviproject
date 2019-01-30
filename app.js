var express = require('express'),
    bodyParser = require('body-parser'),
    path = require("path"),
    request = require("request");

var app = express();

// create application/json parser
app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//Set static path for ststic resources
app.use(express.static(path.join(__dirname, "public")));


app.get("/", function (req, res) {
    var courseList = [];
   
        request("https://api.umd.io/v0/courses/list", function (error, response, body) {
            {
                if (!error) {
                    var parsedData = JSON.parse(body);
                    //adding each course to "courseList"
                    parsedData.forEach(function (element) {
                        courseList.push(element["course_id"]);
                    });
                    console.log(" 1 length of array is:" + courseList.length);
                }
                else
                    console.log("some mannual error 1")
            }
            funciton() {
                var courseListString = "";

                courseList.forEach(x => {
                    courseListString = courseListString + x + ",";
                });
                request("https://api.umd.io/v0/courses/", function (error, response, body1) {
                    var parsedData1 = JSON.parse(body1);
                    res.send(parsedData1);
                }
               
                });
    });
            


//coverting courseList from array to string


var courseListString = "";

courseList.forEach(x => {
    courseListString = courseListString + x + ",";
});
request("https://api.umd.io/v0/courses/", function (error, response, body1) {
    var parsedData1 = JSON.parse(body1);
    res.send(parsedData1);
});
    

    
});


app.listen(3000, function () {
    console.log("server started at port 3000");
});
