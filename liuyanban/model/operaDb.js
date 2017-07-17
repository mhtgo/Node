var MongoClient = require('mongodb').MongoClient;
var dbUrl = require("../settings.js");

// Connection URL
var url = dbUrl.url;

//连接数据库
function collectdb(callback){
    MongoClient.connect(url, function(err, db) {
        if(err){
            callback(err,null);
            return;
        }
        callback(null,db)
    })
}

//往数据库插入时
exports.insertOne = function(collectionName,json,callback){
    collectdb(function(err,db){
        db.collection(collectionName).insertOne(json,function(err,rusult){
            if(err){
                callback(err,null);
                return;
            }
            callback(null,rusult);
            db.close();
        })
    })
}

//数据库修改
exports.updateMany= function(collectionName,oJson,nJosn,callback){
    collectdb(function(err,db){
        db.collection(collectionName).updateMany(oJson,nJosn,function(err,rusult){
            if(err){
                callback(err,null);
                return;
            }
            callback(null,rusult);
            db.close();
        })
    })
}

//数据库删除
exports.deleteMany= function(collectionName,json,callback){
    collectdb(function(err,db){
        db.collection(collectionName).deleteMany(json,function(err,rusult){
            if(err){
                callback(err,null);
                return;
            }
            callback(null,rusult);
            db.close();
        })
    })
}


//查询数据库
//参数1 为 collection名称
//参数2 为 筛选json
//参数3 为 分页参数
//参数4 为 回调函数

exports.finddb = function(A,B,C,D){
    var collectionName = A;
    var callback = null;
    var json = {};
    var args = {
        "countNum" : 0,
        "page" : 0
    };

    if(arguments.length == 2){
        callback = B;
    }else if(arguments.length == 3){
        if(Array.isArray(B)){
            args.countNum = B[0];
            args.page = B[1];
        }else{
            json = B;
        }
        callback = C;
    }else if(arguments.length == 4){
        json = B;
        args.countNum = C[0];
        args.page = C[1];
        callback = D;
    }else{
        console.log("参数个数错误");
        return;
    }


    collectdb(function(err,db){

        var cursor = db.collection(collectionName).find(json).limit(args.countNum).skip(args.countNum*args.page);
        var result = [];
        cursor.each(function(err,doc){
            if(err){
                callback(err,null);
                return;
            }
            if(doc != null){
                result.push(doc);
            }else{
                callback(null,result)
                db.close();
            }
        })
    })
}

//获取数据总共条数
exports.getAllCount = function (collectionName,callback) {
    collectdb(function (err, db) {
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
            db.close();
        });
    })
}

