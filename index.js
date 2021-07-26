//初始化伺服器
const express = require('express');
const jszip=require('jszip');
const path=require('path');
const fs=require('fs');
var app = express();

function fread(filename){
    return fs.readFileSync(filename,'utf-8');
}

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'src/index.htm'));
})

app.get('/src/:file',(req,res)=>{
    res.sendFile(path.join(__dirname, '/src/',req.params.file));
})
app.get('/googleedc68a32f2606c22.html',(req,res)=>{
    res.sendFile(path.join(__dirname, '/src/googleedc68a32f2606c22.html'));
})
app.get('/craft.zip',(req, res)=>{
    let zip=new jszip();
    zip.file(`${req.query.datapack}/pack.mcmeta`,fread(path.join(__dirname,'res/pack.mcmeta')))
    zip.file(`${req.query.datapack}/data/${req.query.namespace}/recipes/${req.query.recipename}.json`,req.query.recipejson)
    zip.generateAsync({type:"nodebuffer"})
    .then(data=>{
        //res.setHeader('Content-Disposition', `filename="${req.query.datapack}"`);
        res.send(data);
    });
})

app.get('/user.py',(req,res)=>{
    let data=fread(path.join(__dirname,'res/user.py'));
    data=data.replace('mcpath',req.query.mcpath);
    data=data.replace('yourname',req.query.yourname);
    res.send(data);
})

//開始監聽 port 3000
app.listen(process.env.PORT||3000, function () {
  console.log('Example app listening on http://127.0.0.1:3000/')
})