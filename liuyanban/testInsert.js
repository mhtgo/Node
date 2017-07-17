var express = require("express");
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/messageDB';

var app = express();
app.get("/",function(req,res){
    MongoClient.connect(url, function(err, db) {

        db.collection("message").insertOne({
            "name" : "网友"+parseInt(Math.random()*89999+10000),
            "message" : "测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字",
            "nowtime" : new Date()
        },function(err,result){
            res.send("添加成功");
            db.close();
        })
    });
})

app.listen(3000);