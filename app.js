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
    database : 'draft2'
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });
  
 
var allData=[];
var courseList = [];
app.get("/",courseArray,addToDatabase);


    
function courseArray(req,res,next) {
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
        request("https://api.umd.io/v0/courses/astr100?expand=sections", function (error, response, body) {
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
                objArray.push(Number(manageTime(parsedData1.sections[i].meetings[j].start_time)));
                objArray.push(Number(manageTime(parsedData1.sections[i].meetings[j].end_time)));
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
        next();
        });
    });

}
    
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

// Adding into database draft2
// Sample Data 'CMSC132-0301L', 'MWF',  1200, 1250, 'ARM', '0135'
//  Schema of draft2
//  courseId varchar(20),
//  day varchar(4),
//  startTime int,
//  endTime int,
//  buildingName varchar(20),
//  roomNo varchar(6)
// [ 'ASTR100-0101L', 'TuTh', 930, 1045, 'PHY', '1412' ]
// )
function addToDatabase(req,res){
    var l =0;
    console.log("inside add to database function");
    console.log(allData.length + " and l is " + l);
    while(  l < allData) {
            console.log("Entering here");
            console.log(allData[l] + " Nothing Here");           
            l++;
        }
    let stmt = `INSERT INTO objects(courseId,day,startTime,endTime,buildingName,roomNo) VALUES ?  `;
    let todos = [
    ['ASTR101-0104L', 'TuTh', 930, 1045, 'PHY', '1412'] 
    ];
    
    // execute the insert statment
    connection.query(stmt, [todos], (err, results, fields) => {
    if (err) {
        return console.error(err.message);
    }
    // get inserted rows
    console.log('Row inserted:' + results.affectedRows);
    });
    connection.end();
    res.end;
}


app.listen(4020, function () {
    console.log("server started at port 3010");
});
