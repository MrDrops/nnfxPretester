//contains the original script for front end before rewrite and cleanup

function ajax(method, url, callbackF, sendObj="") {
    /* 
    Ajax example using older way. Not in use. Just to compare with fetch
    */
    console.log('in ajax func');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log('pre onreadyStateChange');
        console.log(this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            callbackF(this);
        };
    };   
    console.log('checkpoint');
    xhttp.open(method, url, true);
    console.log("in ajax between open and send");
    console.log(sendObj);
    xhttp.setRequestHeader("content-type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(sendObj));
};

//ajax using fetch
function fajax(method, url, data="") {
    /* 
    Universal use ajax function to connect to server, use any method and
    relay data if needed
    in:
        method - str [GET, POST...]
        url - str [/meta-form, etc]
        data - str (optional) [for data transfer]
    */
    if(data == false) {
        console.log('not a post or put method');
    } else {
        const aFetch = fetch(url, {
            method: method,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        aFetch.then(res => {
            console.log('fetch success');
            return res.json();
        })
        .then(json => {
            console.log(json);
        })
        .catch(err => console.log(err));
    };

}

function metaFormCallback() {
    /* 
    function called by Start Test button f() to "lock" Meta form
    and "unlock" trade form
    */
    document.getElementById("trade-input-lock").removeAttribute("disabled");
    document.getElementById("meta-input-lock").setAttribute("disabled", "disabled");
};

//all input data validation functions
function testPair(inPair) {
    /*
    Called by validators to verify pair name input
    in: str input forex pair (6chrs) from meta-trade-form
    return: array [bool, str] 
    */
    const pairs = ['usd', 'gbp', 'chf', 'eur', 'jpy', 'aud', 'cad', 'nzd'];
    let err = false;
    const base = inPair.slice(0,3);
    const quote = inPair.slice(3,6);
    let tof = pairs.includes(base) && pairs.includes(quote);
    if (tof == false) {
        err = true;
    };
    if(base == quote) {
        err = true;
    };
    return [err, "pair name"];
};

function testDates(inDate) {
    /*
    Called by validators to verify if date input are correct
    in: str (6chrs) ddmmyy
    return: array [bool, str]
    */
    const day = inDate.slice(0,2);
    const month = inDate.slice(2,4);
    const year = inDate.slice(4,6);
    let err = false;
    const datePattern = /\d{6}/;

    if (datePattern.test(inDate) == false) {
        err = true;
    }
    if (month < 1 || month > 12) {
        err = true;
    }
    if (day < 1 || day > 31) {
        err = true;
    }
    if ([1,3,5,7,8,10,12].includes(parseInt(month)) && day > 31) {
        err = true;
    }
    if ([4, 6, 9, 11].includes(parseInt(month)) && day > 30) {
        err = true;
    }
    if (parseInt(month) == 2 && day > 29) {
        err = true;
    }
    
    return [err, "start/end date"];
}

function fixDates(inDate) {
    /*
    fixes the str date input once verified to mysql friendly date
    datatype
    in: str 6(chrs) ddmmyy
    return: str formatted in mySql date type style
    */
    let regPat = /\d{2}/g;
    let strNum = inDate.toString();
    let pairDate = strNum.match(regPat);
    pairDate.reverse();
    if (pairDate[0] >= 0 && pairDate[0] < 50) {
        pairDate[0] = '20' + pairDate[0];
    } else {
        pairDate[0] = '19' + pairDate[0];
    }
    return pairDate.join("-");
};

function testRisk(inRisk) {
    /*
    called by validator to test risk input is within correct range
    in: str risk value (float) per trade
    return: array [bool, str]
    */
    const riskPattern = /\d/;
    let err = false;
    if (riskPattern.test(inRisk) == false) {
        err = true;
    }
    if (inRisk > 2 || inRisk <= 0) {
        err = true;
    }
    return [err, "risk per trade"];
};

function testIndis(inIndi) {
    /*
    called by validator to test indicators input format
    in: str indicator name/ parameters
    return: array [bool, str]
    */
    const paramsPattern = /\w+/;
    let err = false;
    if (inIndi.length > 0) {
        if (paramsPattern.test(inIndi) == false) {
            err = true;
        };
    };
    return [err, "indicators/parameters"]
};

function testC1(inC1) {
    /*
    called by validator to test C1 indicators/parameters input format
    in: str indicator name/ parameters
    return: array [bool, str]
    */
    const paramsPattern = /\w+/;
    let err = false;
    if (inC1.length == 0 || paramsPattern.test(inC1) == false) {
            err = true;
    };
    return [err, "C1 indicator and/or parameter"]
}

function metaValidator() {
    /*
    Called by startTestBtn() to validate all the input form fields in
    meta-trade-form
    return: bool(false) || array (containing form values)
    */
    const metaFormValues = {
        pairName : document.getElementById("pair").value,
        pStart : document.getElementById("period-start").value,
        pEnd : document.getElementById("period-end").value,
        percRisk : document.getElementById("per-risk-trade").value,
        c1Indi : document.getElementById("entry-indi").value,
        c1Params : document.getElementById("entry-params").value,
        blineIndi : document.getElementById("baseline-indi").value,
        blineParams : document.getElementById("baseline-params").value,
        exitIndi : document.getElementById("exit-indi").value,
        exitParams : document.getElementById("exit-params").value,
        volIndi : document.getElementById("volume-indi").value,
        volParams : document.getElementById("vol-params").value,
        c2Indi : document.getElementById("confir2-indi").value,
        c2Params : document.getElementById("conf2-params").value,
    };
    const validTests = [
        testPair(metaFormValues.pairName),
        testDates(metaFormValues.pStart),
        testDates(metaFormValues.pEnd),
        testRisk(metaFormValues.percRisk),
        testC1(metaFormValues.c1Indi),
        testC1(metaFormValues.c1Params),
        testIndis(metaFormValues.blineIndi),
        testIndis(metaFormValues.blineParams),
        testIndis(metaFormValues.exitIndi),
        testIndis(metaFormValues.exitParams),
        testIndis(metaFormValues.volIndi),
        testIndis(metaFormValues.volParams),
        testIndis(metaFormValues.c2Indi),
        testIndis(metaFormValues.c2Params),
    ];
    let warnMsg = "";
    let errCount = 0;

    for (let i=0; i < validTests.length; i++) {
        if (validTests[i][0] == true) {
            warnMsg += '\n' + "- " + validTests[i][1];
            errCount =+ 1;
        };
    };
    if (errCount > 0) {
        console.log('FAILED');
        let msg = 'Please check your input:'.concat(warnMsg);
        window.alert(msg);
        return false;
    };

    console.log('validator checkpoint');
    metaFormCallback();
    metaFormValues.pStart = fixDates(metaFormValues.pStart);
    metaFormValues.pEnd = fixDates(metaFormValues.pEnd);
    console.log(metaFormValues);
    console.log('YOU SHALL PASS');
    return metaFormValues;
};

// function oldValidator() {
//     function fixDates(inNum) {
//         let regPat = /\d{2}/g;
//         let strNum = inNum.toString();
//         let pairDate = strNum.match(regPat);
//         pairDate.reverse();
//         if (pairDate[0] > 0 && pairDate[0] < 30) {
//           pairDate[0] = '20' + pairDate[0];
//         } else {
//           pairDate[0] = '19' + pairDate[0];
//         }
//         return pairDate.join("-");
//     };

//     function testPair(inPair) {
//         const pairs = ['usd', 'gbp', 'chf', 'eur', 'jpy', 'aud', 'cad', 'nzd'];
//         const base = inPair.slice(0,3);
//         const quote = inPair.slice(3,6);
//         return pairs.includes(base) && pairs.includes(quote);
//       };

//     const metaFormValues = {
//         pairName : document.getElementById("pair").value,
//         pStart : document.getElementById("period-start").value,
//         pEnd : document.getElementById("period-end").value,
//         percRisk : document.getElementById("per-risk-trade").value,
//         c1Indi : document.getElementById("entry-indi").value,
//         c1Params : document.getElementById("entry-params").value,
//         blineIndi : document.getElementById("baseline-indi").value,
//         blineParams : document.getElementById("baseline-params").value,
//         exitIndi : document.getElementById("exit-indi").value,
//         exitParams : document.getElementById("exit-params").value,
//         volIndi : document.getElementById("volume-indi").value,
//         volParams : document.getElementById("vol-params").value,
//         c2Indi : document.getElementById("confir2-indi").value,
//         c2Params : document.getElementById("conf2-params").value,
//     };
//     //required patterns
//     const pairPattern = /\w{6}/i;
//     const datePattern = /\d{6}/;
//     const riskPattern = /\d/;
//     const paramsPattern = /\w+/;
//     const maxRisk = 2;

//     const checks = {
//         pairNameCheck : pairPattern.test(metaFormValues.pairName) && testPair(metaFormValues.pairName),
//         startDateCheck :  datePattern.test(metaFormValues.pStart) && metaFormValues.pStart.length > 0,
//         endDateCheck : datePattern.test(metaFormValues.pEnd) && metaFormValues.pEnd.length > 0,
//         riskCheck : riskPattern.test(metaFormValues.percRisk) && (metaFormValues.percRisk <= maxRisk),
//         c1Check : metaFormValues.c1Indi.length > 0,
//         c1ParamCheck : paramsPattern.test(metaFormValues.c1Params),
//     };
//     for (let check in checks) {
//         console.log(checks);
//         if (checks[check] == false) {
//             console.log('FAILED');
//             window.alert('Please check your input');
//             return false;
//         };
//     };
//     //modify dates to be as db requires
//     console.log('validator checkpoint');
//     metaFormCallback();
//     metaFormValues.pStart = fixDates(metaFormValues.pStart);
//     metaFormValues.pEnd = fixDates(metaFormValues.pEnd);
//     console.log(metaFormValues);
//     console.log('YOU SHALL PASS');
//     return metaFormValues;
// };

function startTestBtn() {
    /*
    Called by start-test-button to validate form data, submit data to DB
    and unlock trade form
    */
    const formData = metaValidator();
    console.log(formData);
    if (formData == false) {
        console.log('Data input wrong...retry');
    } else {
        console.log('fajax post');
        fajax('POST', '/meta-form', formData);
        //ajax("POST", "/meta-form", metaFormCallback(), formData);
        console.log('post fajax post');
    };
};

function submitTradeClk() {
    /*
    called by submit trade button to call all needed functions to
    validate and process trade input to send to DB
    */
    const tradeData = tradeSubmitValidator();
    if (tradeData != false) {
        createTableRow(tradeData);
        fajax('POST', '/tradeForm', tradeData);
        document.getElementById('tradeForm').reset()
        tradeInputConfirm();
    };
};

function newTradeSubmitValidator() {
    const tradeData = {
        entryDate : document.getElementById("trade-date").value,
        entryPrice : parseFloat(document.getElementById("entry-price").value),
        atr : parseFloat(document.getElementById("atr").value),
        exitDate : document.getElementById("exit-date").value,
        exitPrice : parseFloat(document.getElementById("exit-price").value),
        lorS : document.getElementById("l-or-s").value,
        hitTp : document.getElementById("hit-tp").value,
        hitSl : document.getElementById("hit-ls").value,
        hiPrice : parseFloat(document.getElementById("hi-price").value),
        loPrice : parseFloat(document.getElementById("low-price").value),
    };
    const pair = document.getElementById("pair").value;
    let errCount = 0;
    let warnMsg = "";

    let enDateErr, exDateErr = [testDates(tradeData.entryDate), testDates(tradeData.exitDate)];
};

function tradeSubmitValidator() {
    /*
    called by submitTradeClk() to validate trade input form values
    before submitting to DB
    return: bool(false) || array (validated trade values)
    */
    const datePattern = /\d{6}/;
    const pricePattern = /\d/;

    const tradeData = {
        entryDate : document.getElementById("trade-date").value,
        entryPrice : document.getElementById("entry-price").value,
        atr : document.getElementById("atr").value,
        exitDate : document.getElementById("exit-date").value,
        exitPrice : document.getElementById("exit-price").value,
        lorS : document.getElementById("l-or-s").value,
        hitTp : document.getElementById("hit-tp").value,
        hitSl : document.getElementById("hit-sl").value,
        hiPrice : document.getElementById("hi-price").value,
        loPrice : document.getElementById("low-price").value,
    };

    const checks = {
        entryDateCheck : datePattern.test(tradeData.entryDate),
        entryPriceCheck : pricePattern.test(tradeData.entryPrice),
        atrCheck : pricePattern.test(tradeData.atr),
        exitDateCheck : datePattern.test(tradeData.exitDate),
        exitPriceCheck : pricePattern.test(tradeData.exitPrice),
        hiPriceCheck : pricePattern.test(tradeData.hiPrice),
        loPriceCheck : pricePattern.test(tradeData.loPrice),
    };
    for (let check in checks) {
        if(checks[check] == false) {
            window.alert('Please check your input');
            return false;
        } else {
            console.log('submit trade check');
            tradeData.entryDate = fixDates(tradeData.entryDate);
            tradeData.exitDate = fixDates(tradeData.exitDate);
            document.getElementById("tpp").innerHTML = "";
            document.getElementById("slp").innerHTML = "";
            return tradeData;
        };
    }
};

function autoTpSlPrices() {
    const lors = document.getElementById("l-or-s").value;
    const entryPrice = parseFloat(document.getElementById("entry-price").value);
    const atr = parseFloat(document.getElementById("atr").value);
    let tpp;
    let slp;
    if(lors == "long") {
        tpp = entryPrice + atr;
        slp = entryPrice - (1.5 * atr);
    } else {
        tpp = entryPrice - atr;
        slp = entryPrice + (1.5 * atr);
    };
    document.getElementById("tpp").innerHTML = "Take profit: " + tpp;
    document.getElementById("slp").innerHTML = "Stop loss: " + slp;
}

function createTableRow(tradeData) {
    /*
    Create an html table in front-end of basic trade input data after it
    has been sent to the DB
    */
    console.log("create table check");
    const table = document.getElementById("trade-table");
    let rowNum = table.rows.length;
    let row = table.insertRow(1);
    let tdTradeNum = row.insertCell(0)
    let tdDate = row.insertCell(1);
    let tdLorS = row.insertCell(2);
    let tdHitTp = row.insertCell(3);
    let tdHitSl = row.insertCell(4);
    let tdProfit = row.insertCell(5);
    let tdAccPer = row.insertCell(6);
    let tdErase = row.insertCell(7);
    let ErBtn = document.createElement("BUTTON");
    ErBtn.innerHTML = "X";
    ErBtn.setAttribute("id", "EraseTradeBtn");

    function calcPoints() {
        /*
        calculates each trade's account percentage and drawdown
        return: array [float, float] (account, drawdown)
        */
        let ans;
        const risk = parseFloat(document.getElementById("per-risk-trade").value);
        let atr = parseFloat(tradeData.atr)
        let entryPrice = parseFloat(tradeData.entryPrice)
        let exitPrice = parseFloat(tradeData.exitPrice)
        if (tradeData.lorS == "long") {
            if (tradeData.hitTp == "true") {
                ans = atr + (exitPrice - entryPrice)
                //console.log('path a');
            } else {
                ans = (exitPrice - entryPrice) * 2;
                //console.log('test path b');
            }
        } else {
            if (tradeData.hitTp == "true") {
                ans = atr + (entryPrice - exitPrice)
                //console.log('path c');
            } else {
                ans = (entryPrice - exitPrice) * 2;
                //console.log('path d');
            }
        };
        const accPer = ans > 0 ? ans / (1.5 * atr * 2) * risk * 2 : (Math.abs(ans) / (1.5 * atr * 2)) * risk * 2 * -1;
        return [ans.toFixed(5), accPer.toFixed(3)];
    };
    //adds a new line to the trade table with the input data
    tdTradeNum.innerHTML = rowNum;
    tdDate.innerHTML = tradeData.entryDate;
    tdLorS.innerHTML = tradeData.lorS;
    tdHitTp.innerHTML = tradeData.hitTp;
    tdHitSl.innerHTML = tradeData.hitSl;
    [tdProfit.innerHTML, tdAccPer.innerHTML] = calcPoints();
    tdErase.appendChild(ErBtn);
    //updates current trade results
    let pyl = parseFloat(document.getElementById("p-and-l").innerHTML);
    let maxDown = parseFloat(document.getElementById("max-down").innerHTML);
    pyl = pyl + parseFloat(tdAccPer.innerHTML);
    document.getElementById("p-and-l").innerHTML = pyl.toFixed(1);
    if (pyl < 0) {
        if (pyl < maxDown) {
            document.getElementById("max-down").innerHTML = pyl.toFixed(1);
        };
    };
};

function tradeInputConfirm() {
    /*
    called by submitTradeClk(). Pops up msg confirming trade was
    submitted to db
    */
    const tradeArea = document.getElementById("meta-input-lock");
    const confirmSign = document.createElement("div");
    const text = document.createTextNode("Trade data submitted");
    confirmSign.appendChild(text);
    confirmSign.setAttribute('id', 'trade-conf-sign');
    tradeArea.appendChild(confirmSign);
    setTimeout(()=>{
        document.getElementById('trade-conf-sign').remove();
        document.getElementById('trade-date').focus();
    }, 750);

};

function submitToDB() {
    /*
    Pops up confirmation msg to finalize current test and reload forms for new test
    */
    const confirm = window.confirm("Finalize test and clear form?\n (Data input is complete?)");
    if(confirm == true) {
        location.reload();
    }; 
};

function resultButton() {
    /*
    Pops up confirmation msg to finalize current test and go to current
    test result page
    */
    const confirm = window.confirm("Finalize test and go to results page?");
    if(confirm == true) {
        location.href = "http://localhost:3000/results.html";
    };
};
