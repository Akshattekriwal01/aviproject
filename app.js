var express = require('express'),
    bodyParser = require('body-parser'),
    path = require("path"),
    request = require("request");
    mysql      = require('mysql');
    convertTime = require('convert-time'); 
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

        request("https://api.umd.io/v0/courses/ECON200?expand=sections", function (error, response, body) {
            console.log("connectiong with umd id sections");    
        var parsedData1 = JSON.parse(body);
        var allData=[];
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
                objArray.push(manageTime(parsedData1.sections[i].meetings[j].start_time));
                objArray.push(manageTime(parsedData1.sections[i].meetings[j].end_time));
                objArray.push(parsedData1.sections[i].meetings[j].building);
                objArray.push(parsedData1.sections[i].meetings[j].room);
               
               allData.push(objArray); 
                // console.log("===================")
                // for(var c = 0 ; c< objArray.length; c++)    
                // console.log(objArray[c]);
                // console.log("===================")
            }
       
        }  
        var l =0;
        while( l < allData.length){
           
            
            console.log(allData[l]);
            
            
            l++;
        }
        
        res.send(body);

        });
    });

});
// function to convert hh:mm am/pm to hhmm in 24 hour format
function manageTime(str)  {
    var dayTime = str.substring(str.length-2);
    var pos = str.indexOf(":");
    var hour = Number(str.substring(0,pos));
    var min = str.substring(pos+1,str.length-2);
    if(dayTime == "pm" && hour != 12){
        hour= hour  + 12;
    }
    var time = (""+hour+""+min);
    return time;
}
connection.end();

app.listen(3000, function () {
    console.log("server started at port 3000");
});
