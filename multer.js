const express=require('express');
const multer=require('multer');
const fs=require('fs');
const app=express();
const upload=multer({dest:"uploads/"})
 app.use(express.static("uploads"));
app.use(express.static("public5"));
app.use(express.json());
app.get("/gettodo",(req,res)=>{
    fs.readFile("data.txt","utf-8",(err,data)=>{
        let todos;
        if(data.length===0){
            todos=[];
        }
        else{
            todos=JSON.parse(data);
        }
        res.json(todos);
    })
})
app.post("/savetodo",upload.single("file"),(req,res)=>{
    fs.readFile("data.txt","utf-8",(err,data)=>{
        let todos;
        if(data.length===0){
            todos=[];
        }
        else{
            todos=JSON.parse(data);
        }
        a=req.body;
        a.file=req.file.filename;
        todos.push(a);
     fs.writeFile("data.txt",JSON.stringify(todos),(err)=>{
        if(err)
        {
            throw err;
        }
     })
    })
    res.send(req.file.filename);
})
app.post("/read",(req,res)=>{
    fs.readFile("data.txt","utf-8",(err,data)=>{
        let todos;
        if(data.length===0){
            todos=[];
        }
        else{
            todos=JSON.parse(data);
        }
        todos.forEach((todo)=>{
            if(todo.id==req.body.id)
            {
                if(todo.iscomplete==="false" || todo.iscomplete===false){
                    todo.iscomplete=true;
                }
                else{
                    todo.iscomplete=false;
                }
            }
        })
        fs.writeFile("data.txt",JSON.stringify(todos),(err)=>{
            res.end();
        })
    })
})
app.delete("/delete",(req,res)=>{
    fs.readFile("data.txt","utf-8",(err,data)=>{
        let todos;
        if(data.length===0){
            todos=[];
        }
        else{
            todos=JSON.parse(data);
        }
        const arr=todos.filter((todo)=>{
            return todo.id!=req.body.id;
    })
    todos=arr;
    fs.writeFile("data.txt",JSON.stringify(todos),(err)=>{
        res.end();
    })
})
})
app.listen(3000,()=>{
    console.log("listening at port 3000");
})