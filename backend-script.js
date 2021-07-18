const express = require('express');
const path = require('path');
const db = require('./services/dbqueries');
const fixQuery = require('./services/fixinsert');

var PORT = process.env.port || 3000;

const app = express();

//Middleware
//functions that execute when a specific route is hit
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));

//Routes
app.post('/meta-form', (req, res) => {
    /*
    receives input from meta-form and passes it to meta table in DB
    */
    const metaFormData = req.body;
    const metaValues = fixQuery.sortMetaFormData(metaFormData);
    db.addMetaRow(metaValues).then(()=>{
        console.log('meta data in db');
        res.status(200).json('it worked');
    });
});

app.post('/tradeForm', (req,res) => {
    /*
    receives input from trade form, curates it, passes it to DB
    */
    const preTestId = db.inTradePreTestId();
    const testId = db.testId();
    const tradeId = db.tradeId();

    const allIds = Promise.all([preTestId, testId, tradeId])
    .then(ids => {
        //checks & sets testId & tradeId, adds it to the trade data
        let td = req.body;
        td.testId = ids[1];
        td.tradeId = ids[0] < ids[1] ? 1 : (ids[2] + 1);
        return td;
    })
    .then((td)=> {
        //organizes trade data to match MySql table's datatypes. Sends data to DB
        const sortedTd = fixQuery.sortTradeData(td);
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