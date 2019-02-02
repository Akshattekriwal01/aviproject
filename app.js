var express = require('express'),
    bodyParser = require('body-parser'),
    path = require("path"),
    request = require("request");
    mysql      = require('mysql');

var app = express();

// create application/json parser
//app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//Set static path for ststic resources
app.use(express.static(path.join(__dirname, "public")));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Domain123',
    database : 'draft1'
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });
  
  
  connection.query('SELECT * FROM student where  gpa >= 2.50', function (error, results, fields) {
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
      console.log(results[0].name);
    });
  


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
                 

        courseList.forEach(x => {
            courseListString = courseListString + x + ",";
        });     

        request("https://api.umd.io/v0/courses/cmsc132?expand=sections", function (error, response, body) {
            console.log("connectiong with umd id sections");    
        var parsedData1 = JSON.parse(body);
        for(var i  = 0; i < parsedData1.sections.length; i++){
            for(var j = 0; j < parsedData1.sections[i].meetings.length ; j++)
            {   var objArray = [];              
                if(j==0){                    
                    objArray.push(parsedData1.sections[i].section_id+"L");
                }
               else{
                    objArray.push(parsedData1.sections[i].section_id+"D");
               }
                objArray.push(parsedData1.sections[i].meetings[j].days);
                objArray.push(parsedData1.sections[i].meetings[j].start_time);
                objArray.push(parsedData1.sections[i].meetings[j].end_time);
                objArray.push(parsedData1.sections[i].meetings[j].building);
                objArray.push(parsedData1.sections[i].meetings[j].room);
            
                console.log("===================")
                for(var c = 0 ; c< objArray.length; c++)    
                console.log(objArray[c]);
                console.log("===================")
            }
       
            
      
            }  
        
        
        res.send(body);

        });
    });

});

connection.end();

app.listen(3000, function () {
    console.log("server started at port 3000");
});
