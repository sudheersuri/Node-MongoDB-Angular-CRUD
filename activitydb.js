var MongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser')
var mydbinstance;

const express= require('express');
const assert = require('assert');
const app = new express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded(true));

connect_to_database();

//change this !
activities = '/Users/kartikdatrika/Documents/git_repo/Node-MongoDB-Angular-CRUD/activities.html'

function connect_to_database()
{   
  var url = "mongodb://localhost:27017/";
  
  MongoClient.connect(url,function(err,db)
  {
   assert.equal(null, err);
   console.log("Connected correctly to server");
   if(err)
    throw err;
    mydbinstance=db.db("mydb");
 });
}

app.get('/',function(req,res)
{
  res.sendFile(activities);
});

app.get('/display',function(req,res)
{
  
  mydbinstance.collection("life").find().toArray(function(err,result)
 {
   res.json(result);  
  });
});

app.post('/add',function(req,res)
{
 var nextId = mydbinstance.collection("life").find().sort({_id:-1}).limit(1).toArray(function(err,result)
 {
  return result[0].obid;
 });
  
  if(nextId == null)
    nextId=1;
  else
    nextId=parseInt(nextId)+1;

  var dataobj = {obid:nextId,acdate:req.body.acdate,activity:req.body.activity,timespent:req.body.timespent};
  mydbinstance.collection("life").insertOne(dataobj,function(err,res)
  {
  if(err)
    throw err;
  });

  mydbinstance.collection("life").find().toArray(function(err,result)
  {
   res.json(result);  
  });
 
}); 

app.post('/update',function(req,res)
{
  var query={obid:req.body.id};
  var newvalues={ $set :{obid:req.body.id,activity:req.body.activity,timespent:req.body.timespent} };
  mydbinstance.collection("life").updateOne(query,newvalues,function(err,res){
    if(err)
      throw err;
    console.log(res.result.n + " document(s) updated");
  }); 

});

app.post('/del',function(req,res)
{
  
  var query={obid:req.body.id};
  mydbinstance.collection("life").deleteOne(query,function(err,res){
    if(err)
      throw err;
    console.log(res.result.n + " document(s) deleted");
  }); 

});


app.listen(3005)
