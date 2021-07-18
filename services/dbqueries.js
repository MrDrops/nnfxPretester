const db = require('./db');
const helper = require('../helper');
const config = require('../config');

//This file acts as a bridge between the route and the database

//basic example get name of pair in test_id=1
async function getPair() {
    /*
    Fetches pair name from db
    Return: str (6chrs)
    */
    try {
        const result = await db.query(
            'select pair from meta where test_id = 1', []
        );
        return result[0].pair;
    } catch(err) {
        console.error(err);
    };    
};

async function getRisk() {
    /*
    Fetches risk per trade from db
    Return: float (percentage risk per individual trade)
    */
    try {
        const result = await db.query(
            'select risk_per from meta where test_id = 1', []
        );
        return result[0].risk_per;
    } catch(err) {
        console.error(err);
    };
    
};

async function addMetaRow(strVal) {
    /*
    takes meta-form input values to DB
    in: array len(14) (meta-form input values)
    */
    try {
        await db.query(
            `insert into meta (pair, period_start, period_end, risk_per, c1, baseline, exitIndi, volume, c2, c1_params, bline_params, exit_params, vol_params, c2_params) 
            values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, strVal
        );
    } catch(err) {
        console.error(err);
    };
};

async function testId() {
    /*
    Fetches last test id in meta table from db
    Return: int
    */
    try {
        const testId = await db.query(
            'select test_id from meta order by test_id desc limit 1', []
        );
        return testId[0].test_id;
    } catch(err) {
        console.error(err);
    }; 
};

async function inTradePreTestId() {
    /*
    Fetches last test id in trade(2nd last in meta table) table from db
    Return: int
    */
    try {
        const testId = await db.query(
            'select test_id from trades order by test_id desc limit 1', []
        );
        return testId[0].test_id;
    } catch(err) {
        console.error(err);
    }; 
};

async function tradeId() {
    /*
    Fetches last trade id from db
    Return: int
    */
    try {
        const tradeId = await db.query(
            'select trade_id from trades order by test_id desc, trade_id desc limit 1', []
        );
        return tradeId[0].trade_id;
    } catch(err) {
        console.log(err);
    };
};

async function addTradeRow(strVals) {
    /*
    takes trade form input values to DB
    in: array len(12) (trade data values)
    */
    try {
        await db.query(
            `insert into trades (test_id, trade_id, date, entry_price, atr, exit_date, exit_price, long_short, hit_tp, hit_sl, hi_price, lo_price)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, strVals
        );
    } catch(err) {
        console.error(err);
    };
};

module.exports = {
    getPair,
    getRisk,
    addMetaRow,
    testId,
    tradeId,
    inTradePreTestId,
    addTradeRow
}


