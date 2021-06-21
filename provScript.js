//contains the original script for front end before rewrite and cleanup

function ajax(method, url, callbackF, sendObj="") {
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
        aFetch.then(res =>{
            console.log('fetch success');
            metaFormCallback();
            console.log(res.json());
        })
        .catch(err => console.log(err));
    };

}

function metaFormCallback() {
    document.getElementById("trade-input-lock").removeAttribute("disabled");
    document.getElementById("meta-input-lock").setAttribute("disabled", "disabled");
};

function metaValidator () {
    function fixDates(inNum) {
        let regPat = /\d{2}/g;
        let strNum = inNum.toString();
        let pairDate = strNum.match(regPat);
        pairDate.reverse();
        if (pairDate[0] > 0 && pairDate[0] < 30) {
          pairDate[0] = '20' + pairDate[0];
        } else {
          pairDate[0] = '19' + pairDate[0];
        }
        return pairDate.join("-");
    };

    let validator = true;
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

    //required patterns
    const pairPattern = /\w{6}/i;
    const datePattern = /\d{6}/;
    const riskPattern = /\d/;
    const paramsPattern = /\w+/;
    const maxRisk = 2;
    const pairs = ['usd', 'gbp', 'chf', 'eur', 'jpy', 'aud', 'cad', 'nzd'];
    if (!pairPattern.test(metaFormValues.pairName)) {
        validator = false;
    }
    if (!datePattern.test(metaFormValues.pStart)) {
        validator = false;
    }
    if (!datePattern.test(metaFormValues.pEnd)) {
        validator = false;
    }
    if (!riskPattern.test(metaFormValues.percRisk) || !(metaFormValues.percRisk <= maxRisk)) {
        validator = false;
    }
    if (!metaFormValues.c1Indi.length > 0) {
        validator = false;
    }
    if (!paramsPattern.test(metaFormValues.c1Params)) {
        validator = false;
    }
    if(!validator) {
        console.log('FAILED');
        window.alert('Please check your input');
        return false;
        //e.preventDefault();
    } else {
        //modify dates to be as db requires
        console.log('validator checkpoint');
        metaFormValues.pStart = fixDates(metaFormValues.pStart);
        metaFormValues.pEnd = fixDates(metaFormValues.pEnd);
        console.log(metaFormValues);
        return metaFormValues;
        // console.log('YOU SHALL PASS');    
    };
}

// function startTestBtn() {
//     const formData = metaValidator();
//     console.log(formData);
//     if (formData == false) {
//         console.log('Data input wrong...retry');
//     } else {
//         console.log('ajax post');
//         ajax("POST", "/meta-form", metaFormCallback(), formData);
//         console.log('post ajax post');
//     };
// };

function startTestBtn() {
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
    const validator = tradeSubmitValidator();
    if(validator) {
        createTableRow();
        //get data from form
        //send data to server
    }
}

function tradeSubmitValidator() {
    let validator = true;
    const entryDate = document.getElementById("trade-date").value;
    const atr = document.getElementById("atr").value;
    const entryPrice = document.getElementById("entry-price").value;
    const exitPrice = document.getElementById("exit-price").value;

    const datePattern = /\d{6}/;
    const pricePattern = /\d/;

    if(!datePattern.test(entryDate)) {
        validator = false;
        console.log(datePattern.test(entryDate));
    }
    if (!pricePattern.test(atr)) {
        validator = false;
    }
    if(!pricePattern.test(entryPrice)) {
        validator = false;
    }
    if(!pricePattern.test(exitPrice)) {
        validator = false;
    }
    if (validator) {
        createTableRow();
    }
    return validator;
}

function createTableRow() {
    if (!validator) {
        console.log("input fail");
    } else {
        console.log("trade input correct");
        const entryDate = document.getElementById("trade-date").value;
        const atr = document.getElementById("atr").value;
        const entryPrice = document.getElementById("entry-price").value;
        const exitPrice = document.getElementById("exit-price").value;
        const longShort = document.getElementById("l-or-s").value;
        const hitTp = document.getElementById("hit-tp").value;
        const hitSl = document.getElementById("hit-ls").value;

        const table = document.getElementById("trade-table");
        let row = table.insertRow(1);
        let tdDate = row.insertCell(0);
        let tdAtr = row.insertCell(1);
        let tdEntryPr = row.insertCell(2);
        let tdLorS = row.insertCell(3);
        let tdHitTp = row.insertCell(4);
        let tdHitSl = row.insertCell(5);
        let tdExitPr = row.insertCell(6);
        let tdErase = row.insertCell(7);
        let ErBtn = document.createElement("BUTTON");
        ErBtn.innerHTML = "X";
        ErBtn.setAttribute("id", "EraseTradeBtn");

        tdDate.innerHTML = entryDate;
        tdAtr.innerHTML = atr;
        tdEntryPr.innerHTML = entryPrice;
        tdLorS.innerHTML = longShort;
        tdHitTp.innerHTML = hitTp;
        tdHitSl.innerHTML = hitSl;
        tdExitPr.innerHTML = exitPrice;
        tdErase.appendChild(ErBtn);

    }
    //checks all input is correct:
    //      date is nnnnnn (n=num)
    //      entr price is n.n
    //      exit price is n.n
    //adds a new line to the trade table with the input data
    //clears current input in trade-input-form
};


function calcResultsClk() {
    console.log();
    //takes all input data in table and returns a bottom div with
    //results:
    //total trades  win loss    0-loss  profit/loss%    Max drawdown
};

function instrucClk() {
    console.log();
    //prompts a popup explaining how to use manual backtester
};

function saveDataClk() {
    console.log();
    //saves metadata, trade data and results to excel/server
};

function clearResetClk() {
    console.log();
    //clears all metadata and trade data to start a new backtest
};