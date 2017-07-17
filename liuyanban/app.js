var express = require("express");
var app = express();
var operaDb = require("./model/operaDb.js");
var formidable = require('formidable');
var ObjectId = require('mongodb').ObjectID;



//设置模板引擎
app.set("view engine", "ejs");
//静态
app.use(express.static("./public"));

var countNum = 2;                               //每页多少条
var nowPage = 0;                                 //当前第几页

//首页显示留言列表
app.get("/", function (req, res , next) {
    operaDb.finddb("message",[countNum,nowPage],function(err,result){
        if(err){ next(); return;}
        //获取数据总条数
        operaDb.getAllCount("message",function(totalNum){
            res.render("index",{
                "totalPage":Math.ceil(totalNum/countNum),
                "pageMessage":result
            })
        });                                              //数据总共条数
    })
});

//显示分页留言列表
app.get("/:pageNum", function (req, res, next) {
	if(isNaN(req.params.pageNum)){next(); return;}
	console.log(req.params.pageNum)
    nowPage = req.params.pageNum;
    operaDb.finddb("message",[countNum,nowPage],function(err,result){
        if(err){ next(); return;}
        //获取数据总条数
        operaDb.getAllCount("message",function(totalNum){
            res.render("index",{
                "totalPage":Math.ceil(totalNum/countNum),
                "pageMessage":result
            })
        });
    })
});

//提交留言信息
app.post("/",function (req, res , next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        operaDb.insertOne("message", {
            "name" : fields.name,
            "message" : fields.message,
            "nowtime" : new Date()
        }, function (err, result) {
            if(err){ next(); return;}
            res.redirect("/");
            res.end();
        });
    });
});

//删除
app.get("/delete",function(req,res,next){
    console.log("ok")
    var id = req.query.id;
    operaDb.deleteMany("message",{"_id":ObjectId(id)},function(err,result){
        if(err){ next(); return;}
        res.redirect("/");
    });
});

//404
app.use(function(req,res){
    res.send("页面找不到！")
});

app.listen(3000);
