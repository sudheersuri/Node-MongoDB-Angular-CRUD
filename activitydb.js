var MongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser')
var mydbinstance;

const express= require('express');

const app = new express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded(true));

connect_to_database();


function connect_to_database()
{   
  var url = "mongodb://localhost:27017/";
  
  MongoClient.connect(url,function(err,db)
  {
   if(err)
    throw err;
    mydbinstance=db.db("mydb");
  });   
}

app.get('/',function(req,res)
{
  res.sendFile('C://Users/lenovo/Desktop/node/mongo crud/activities.html');
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
 mydbinstance.collection("life").find().sort({_id:-1}).limit(1).toArray(function(err,result)
 {
    var nextId;
    if(result[0].obid == null)
      nextId=1;
    else
      nextId=parseInt(result[0].obid)+1;

    var dataobj = {obid:nextId,acdate:req.body.acdate,activity:req.body.activity,timespent:req.body.timespent};
    mydbinstance.collection("life").insertOne(dataobj,function(err,res)
    {
    if(err)
      throw err;
    });
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
