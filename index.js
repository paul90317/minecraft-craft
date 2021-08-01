//初始化伺服器
const express = require('express');
const jszip=require('jszip');
const path=require('path');
const fs=require('fs');
var app = express();

function fread(filename){
    return fs.readFileSync(filename,'utf-8');
}
function allreplace(str,rep,rep2){
    while(str.indexOf(rep)!=-1){
        str=str.replace(rep,rep2);
    }
    return str;
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
app.get('/datapack.zip',(req,res)=>{
    let zip=new jszip();
    let name=req.query.datapack;
    let data=fread(path.join(__dirname,'res/pack.mcmeta'));
    zip.file(`${name}/pack.mcmeta`,data);
    data=fread(path.join(__dirname,'res/load.json'));
    zip.file(`${name}/data/minecraft/tags/functions/load.json`,data);
    zip.file(`${name}/data/minecraft/tags/functions/tick.json`,data);
    zip.generateAsync({type:"nodebuffer"})
    .then(data=>{
        res.send(data);
    })
})
app.get('/namespace_craft.zip',(req, res)=>{
    let zip=new jszip();
    zip.file(`${req.query.namespace}/recipes/${req.query.recipename}.json`,req.query.recipejson)
    zip.generateAsync({type:"nodebuffer"})
    .then(data=>{
        //res.setHeader('Content-Disposition', `filename="${req.query.datapack}"`);
        res.send(data);
    });
})
app.get('/namespace_craftadv.zip',(req,res)=>{
    let zip=new jszip();
    let data=fread(path.join(__dirname,'res/pack.mcmeta'));
    data=req.query.recipejson;
    let miditem=JSON.parse(data);
    miditem=miditem['result']['item'];
    zip.file(`${req.query.namespace}/recipes/${req.query.recipename}.json`,data);
    data=fread(path.join(__dirname,'res/adv.json'));
    let item=`${req.query.namespace}:${req.query.recipename}`;
    data=allreplace(data,'{item}',item)
    zip.file(`${req.query.namespace}/advancements/${req.query.recipename}_adv.json`,data);
    data=fread(path.join(__dirname,'res/exp.mcfunction'));
    data=allreplace(data,'{item}',item);
    data=allreplace(data,'{miditem}',miditem);
    data=allreplace(data,'{cmds}',req.query.cmds);
    zip.file(`${req.query.namespace}/functions/${req.query.recipename}.mcfunction`,data)
    zip.generateAsync({type:"nodebuffer"})
    .then(data=>{
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