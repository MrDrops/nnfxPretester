const db = require('./db');
const helper = require('../helper');
const config = require('../config');

//This file acts as a bridge between the route and the database

//basic example get name of pair in test_id=1
async function getPair() {
    const result = await db.query(
        'select pair from meta where test_id = 1', []
    );
    return result[0].pair;
};

async function getRisk() {
    const result = await db.query(
        'select risk_per from meta where test_id = 1', []
    );
    return result[0].risk_per;
}
async function addMetaRow(strVal) {
    //const push = 
    await db.query(
        //queryStr, []
        `insert into meta (pair, period_start, period_end, risk_per, c1, baseline, exitIndi, volume, c2, c1_params, bline_params, exit_params, vol_params, c2_params) 
        values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, strVal
    );
    //push;
};

async function testId() {
    const tradeId = await db.query(
        'select test_id from meta order by test_id desc limit 1', []
    );
    return tradeId[0].test_id;
};

async function restartCount() {
    await db.query(
        'alter table trades auto_increment = 1', []
    );
    console.log('auto_increment changed');
};

async function addTradeRow(strVals) {
    //const strVal = strVals;
    //console.log(strVal);
    await db.query(
        `insert into trades (test_id, date, entry_price, atr, exit_date, exit_price, long_short, hit_tp, hit_sl, hi_price, lo_price)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, strVals
    );
    //entry_price, atr, exit_date, exit_price, long_short, hit_tp, hit_sl, hi_price, lo_price
};

module.exports = {
    getPair,
    getRisk,
    addMetaRow,
    testId,
    restartCount,
    addTradeRow
}

//db connection
// const connection = mysql.createConnection({
//     host, user, password, database,
// });

// const con = connection;

// const table = 'meta';
// const metaid = 1;
// testDB = con.query(
//     `select * from meta where ${metaid} = 1`, (err, results, fields) => {
//         if(err) throw err;
//         console.log(results[0].pair);
//         //console.log(results);
// })





