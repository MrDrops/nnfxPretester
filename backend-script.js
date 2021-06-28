const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const db = require('./services/dbqueries');
const fixQuery = require('./services/fixinsert');
//const db = require('./database');


var PORT = process.env.port || 3000;

const app = express();

//Middleware
//functions that execute when a specific route is hit
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));

//Routes
app.post('/meta-form', (req, res) => {
    //console.log(req.headers);
    console.log(req.body);
    const metaFormData = req.body;
    const metaValues = fixQuery.sortMetaFormData(metaFormData);
    console.log(metaValues);
    db.addMetaRow(metaValues).then(()=>{
        db.restartCount();
        console.log('meta data in db');
        res.status(200).json('it worked');
    });
});

app.post('/tradeForm', (req,res) => {
    console.log('trade data from req.body');
    console.log(req.body);
    const tradeData = db.testId()
        .then(id=> {
            return id
        })
        .then(id=> {
            let td = req.body;
            console.log('inside .then');
            console.log(id);
            td.testId = id;
            //return td;
            return td;
        });

    tradeData.then((td)=> {
            const sortedTd = fixQuery.sortTradeData(td);
            console.log(sortedTd);
            db.addTradeRow(sortedTd);
        })
        .then(()=> {
            console.log('trade data in db');
            res.status(200).json("trade Form server check");
        });

});

//let test;
    // db.getPair().then((x)=>{
    //     test = `end point check ${x}`;
    //     console.log(test);
    //     res.status(200).json(test);
    // });

//start listening to the server
app.listen(PORT);