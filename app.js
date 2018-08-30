const express = require('express');
const path = require('path')
const { mongoose } = require('./db/database')

var { ObjectID } = require('mongodb');


const bodyparser = require('body-parser');
const fs = require('fs');

var app = express()

const port = process.env.OBJ_PORT || 12004;
const jwt_key = process.env.JWT_KEY || "alphabetagamma"


//newImports



app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
    extended: true
}))


app.post('/objects', (req, res) => {
    console.log("**/objects entered**");
    console.log(req.body.schemaName);
    console.log(req.body)
    fs.appendFile('./schemas/' + req.body.schemaName + '.js', "var mongoose=require('mongoose');\nvar " + req.body.schemaName + '=mongoose.model("' + req.body.schemaName + '",{"' + req.body.schemaName + '":[' + JSON.stringify(req.body.schemaStructure) + '],"instanceId":{"type":"String"}});\nmodule.exports={' + req.body.schemaName + "}", (err) => {
        console.log(err);
    })

    fs.readFile('./app.js', (err, data) => {
        data = String(data).replace("//newImports", "//newImports\nvar {" + req.body.schemaName + "}=require('./schemas/" + req.body.schemaName + "')");
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.post('/" + req.body.schemaName + "', (req, res) => {\n\tconsole.log(req.body);\n\tvar obj1 = new " + req.body.schemaName + "(req.body);\n\tconsole.log(obj1)\n\obj1.save().then((doc) => {\n\t\tres.send(`${doc}`);\n\t})\n})")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "', (req, res) => {\n\t" + req.body.schemaName + ".find({}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "/:id', (req, res) => {\n\t" + req.body.schemaName + ".find({_id:ObjectId(req.params.id)}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
        fs.writeFile('./app.js', data, (err) => {
            console.log(err);

            res.send({
                "status": "Initiated"
            });

        })
    })
    console.log("**/objects exited**");
})

app.put('/objects/:id', (req, res) => {
    console.log("**/objects entered**");

    fs.appendFile('./schemas/' + req.body.schemaName + '.js', "var mongoose=require('mongoose');\nvar " + req.body.schemaName + '=mongoose.model("' + req.body.schemaName + '",{"' + req.body.schemaName + '":[' + JSON.stringify(req.body.schemaStructure) + '],"instanceId":{"type":"String"}});\nmodule.exports={' + req.body.schemaName + "}", (err) => {
    })
    fs.readFile('./app.js', (err, data) => {
        data = String(data).replace("//newImports", "//newImports\nvar {" + req.body.schemaName + "}=require('./schemas/" + req.body.schemaName + "')");
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.post('/" + req.body.schemaName + "', (req, res) => {\n\tconsole.log(req.body);\n\tvar obj1 = new " + req.body.schemaName + "(req.body);\n\tconsole.log(obj1)\n\obj1.save().then((doc) => {\n\t\tres.send(`${doc}`);\n\t})\n})")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "', (req, res) => {\n\t" + req.body.schemaName + ".find({}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "/:id', (req, res) => {\n\t" + req.body.schemaName + ".find({_id:ObjectId(req.params.id)}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
        fs.writeFile('./app.js', data, (err) => {

            res.send({
                "status": "Initiated"
            });
        })

    })
    console.log("**/objects exited**");
})

app.get('/objects/:id/:name', (req, res) => {

    // getObjects(req.params.id, req.params.name, req.query.mode, req.query.filter || "", req.connection.remoteAddress, jsonwebtoken.verify(req.cookies.token, jwt_key).userId, "actual", res, "", "", "", "", req.cookies.token);

    filterText = req.query.filterText
    mode = req.query.mode;
    search = decodeURI(req.query.search)
    name = req.params.name
    callMode = req.query.mode
    id = req.params.id
    console.log(search);
    console.log(mode);
    if (filterText.length > 0 && mode != "undefined" && mode != undefined && mode == "showAll") {
        console.log("RE");
        // eval(name + '.find(' + (search) + ').then((docs)=>{if(callMode=="actual"){res.send(docs)}else{return docs;}})');
        eval(name + '.find(' + search + ').then((docs)=>{res.send(docs)})');
    }
    else if (filterText.length == 0 && mode != "undefined" && mode != undefined && mode == "showAll") {
        console.log("HERE");
        eval(name + '.find().then((docs)=>{res.send(docs)})');
    }
    else {
        // eval(name + '.findById("' + id + '",(err,docs)=>{if(callMode=="actual"){res.send(docs)}else{doACall(url,method,docs,instanceId,wid,name);return docs;}})');
       console.log(name+"#"+id); 
            eval(name + '.findById("' + id + '",(err,docs)=>{console.log(docs);res.send(docs)})');
    }
});


var oldObjects = [];

app.post('/addObject/:instanceId/:key', (req, res) => {
    console.log("$$");
    key = req.params.key;
    instanceId = req.params.instanceId;
    var body = ('{"' + key + '":' + JSON.stringify(req.body) + ',"instanceId":"' + instanceId + '"}');
    var obj2 = eval("new " + key + '(JSON.parse(body))')
    obj2.save().then((doc) => {
        console.log("#####");
        console.log(doc);
        res.send(doc)
    })
});

//newSettersGetters






app.listen(port, "0.0.0.0", () => {
    console.log("Objects Server started on:", port);
})


