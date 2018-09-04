const express = require('express');
const path = require('path')
const { mongoose } = require('./db/database')

var { ObjectID } = require('mongodb');


const bodyparser = require('body-parser');
const fs = require('fs');

var app = express()

const port = process.env.OBJ_PORT || process.env.PORT || 12004;
const jwt_key = process.env.JWT_KEY || "alphabetagamma"
const logging_enabled = process.env.LOGGING_ENABLED || false


//newImports



app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
    extended: true
}))

// logger = (activity, subActivity, subsubActivity, activityId, status, userId, ipAddress, method) => {
//     if (logging_enabled == true) {
//         if (userId.length > 0) {
//             user.findById(userId, (err, res1) => {
//                 if (res1 != undefined && res1 !== 'undefined' && res1.user != undefined && res1.user !== 'undefined') {
//                     act = new userActivity({
//                         activity, subActivity, subsubActivity, activityId, status, userId, user: res1.user.username, ipAddress, method, logDate: new Date(), domain: "OBJECTS"
//                     });
//                     act.save();

//                 }


//             })

//         } else {
//             act = new userActivity({
//                 activity, subActivity, subsubActivity, activityId, status, userId, user: "", ipAddress, method, logDate: new Date(), domain: "OBJECTS"
//             });
//             act.save();

//         }

//     }
// }

app.post('/objects', (req, res) => {
    //logger("API", "objects", "", req.body.schemaName, "success", "", req.connection.remoteAddress, "POST");

    fs.appendFile('./schemas/' + req.body.schemaName + '.js', "var mongoose=require('mongoose');\nvar " + req.body.schemaName + '=mongoose.model("' + req.body.schemaName + '",{"' + req.body.schemaName + '":[' + JSON.stringify(req.body.schemaStructure) + '],"instanceId":{"type":"String"}});\nmodule.exports={' + req.body.schemaName + "}", (err) => {
    })

    fs.readFile('./app.js', (err, data) => {
        data = String(data).replace("//newImports", "//newImports\nvar {" + req.body.schemaName + "}=require('./schemas/" + req.body.schemaName + "')");
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.post('/" + req.body.schemaName + "', (req, res) => {\n\tvar obj1 = new " + req.body.schemaName + "(req.body);\n\obj1.save().then((doc) => {\n\t\tres.send(`${doc}`);\n\t})\n})")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "', (req, res) => {\n\t" + req.body.schemaName + ".find({}).then((docs) => {\n\t\tres.send(docs);\n\t})\n});")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "/:id', (req, res) => {\n\t" + req.body.schemaName + ".find({_id:ObjectId(req.params.id)}).then((docs) => {\n\t\tres.send(docs);\n\t})\n});")
        fs.writeFile('./app.js', data, (err) => {

            res.send({
                "status": "Initiated"
            });

        })
    })
})

app.put('/objects/:id', (req, res) => {
    //logger("API", "objects", "", req.body.schemaName, "success", "", req.connection.remoteAddress, "PUT");

    fs.appendFile('./schemas/' + req.body.schemaName + '.js', "var mongoose=require('mongoose');\nvar " + req.body.schemaName + '=mongoose.model("' + req.body.schemaName + '",{"' + req.body.schemaName + '":[' + JSON.stringify(req.body.schemaStructure) + '],"instanceId":{"type":"String"}});\nmodule.exports={' + req.body.schemaName + "}", (err) => {
    })
    fs.readFile('./app.js', (err, data) => {
        data = String(data).replace("//newImports", "//newImports\nvar {" + req.body.schemaName + "}=require('./schemas/" + req.body.schemaName + "')");
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.post('/" + req.body.schemaName + "', (req, res) => {\n\tvar obj1 = new " + req.body.schemaName + "(req.body);\n\obj1.save().then((doc) => {\n\t\tres.send(`${doc}`);\n\t})\n})")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "', (req, res) => {\n\t" + req.body.schemaName + ".find({}).then((docs) => {\n\t\tres.send(docs);\n\t})\n});")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "/:id', (req, res) => {\n\t" + req.body.schemaName + ".find({_id:ObjectId(req.params.id)}).then((docs) => {\n\t\tres.send(docs);\n\t})\n});")
        fs.writeFile('./app.js', data, (err) => {

            res.send({
                "status": "Initiated"
            });
        })

    })
})

app.get('/objects/:id/:name', (req, res) => {
    //logger("API", "objects", req.params.name, req.params.id, "success", "", req.connection.remoteAddress, "GET");

    filterText = req.query.filterText
    mode = req.query.mode;
    search = decodeURI(req.query.search)
    name = req.params.name
    callMode = req.query.mode
    id = req.params.id
    if (filterText.length > 0 && mode != "undefined" && mode != undefined && mode == "showAll") {
        // eval(name + '.find(' + (search) + ').then((docs)=>{if(callMode=="actual"){res.send(docs)}else{return docs;}})');
        eval(name + '.find(' + search + ').then((docs)=>{res.send(docs)})');
    }
    else if (filterText.length == 0 && mode != "undefined" && mode != undefined && mode == "showAll") {
        eval(name + '.find().then((docs)=>{res.send(docs)})');
    }
    else {
        // eval(name + '.findById("' + id + '",(err,docs)=>{if(callMode=="actual"){res.send(docs)}else{doACall(url,method,docs,instanceId,wid,name);return docs;}})');
        eval(name + '.findById("' + id + '",(err,docs)=>{res.send(docs)})');
    }
});


var oldObjects = [];

app.post('/addObject/:instanceId/:key', (req, res) => {
    //logger("API", "addObject", req.params.key, req.params.instanceId, "success", "", req.connection.remoteAddress, "POST");

    key = req.params.key;
    instanceId = req.params.instanceId;
    var body = ('{"' + key + '":' + JSON.stringify(req.body) + ',"instanceId":"' + instanceId + '"}');
    var obj2 = eval("new " + key + '(JSON.parse(body))')
    obj2.save().then((doc) => {
        res.send(doc)
    })
});

//newSettersGetters






app.listen(port, "0.0.0.0", () => {
    console.log("Objects Server started on:", port);
})


