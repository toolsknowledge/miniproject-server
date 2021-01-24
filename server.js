const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const bodyparser = require("body-parser");
const jwt = require("jwt-simple");
const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
const ashokIT = mongodb.MongoClient;
let s_token="";
app.post("/login",(req,res)=>{
    ashokIT.connect("mongodb+srv://admin:admin@miniprojectdb.nzphu.mongodb.net/workshop?retryWrites=true&w=majority",(err,connection)=>{
        if(err) throw err;
        else{
            let db = connection.db("workshop");
            db.collection("login_details").find({"uname":req.body.uname,"upwd":req.body.upwd})
              .toArray((err,array)=>{
                if(err) throw err;
                else{
                    if(array.length>0){
                        let token = jwt.encode({"uname":req.body.uname,"upwd":req.body.upwd},
                                                "hr@ashokit.in")
                            s_token = token;
                            res.send({"token":token,"login":"success"});
                    }else{
                        res.send({login:"fail"});
                    }
                }
            });
        }
    });
});

let auth = (req,res,next)=>{
    let allHeaders = req.headers;
    let result = allHeaders.token;
    if(result === s_token){
        next();
    }else{
        res.send({"auth":"unauthorised user"});
    }
};

app.get("/api/products",[auth],(req,res)=>{
    ashokIT.connect("mongodb+srv://admin:admin@miniprojectdb.nzphu.mongodb.net/amazona?retryWrites=true&w=majority",(err,connection)=>{
        if(err) throw err;
        else{
            let db = connection.db("amazona");
            db.collection("products").find().toArray((err,array)=>{
                if(err) throw err;
                else{
				    res.send(array);
                }
            });
        }
    });
});

let port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log("Server Started");
});

