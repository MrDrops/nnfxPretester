//functions that organize the data and the columns to be inserted to the db 
//in meta and trades so that they can be used with the db queries easily

/*
several functions:
determine form the input {object with the form data} what columns are going
to be added to and what data to add.
then it creates the string for the rows to be inserted to
and
the string with the data to be added
*/
function sortMetaFormData(metaFormData) {
    //sort metadata
    function valOrNull(aVar) {
        return aVar.length > 0 ? aVar : null;
    }
    const val = {
        p : metaFormData.pairName,
        ps : metaFormData.pStart,
        pe : metaFormData.pEnd,
        rp : parseFloat(metaFormData.percRisk),
        c1 : metaFormData.c1Indi,
        bl : valOrNull(metaFormData.blineIndi),
        ex : valOrNull(metaFormData.exitIndi),
        vol : valOrNull(metaFormData.volIndi),
        c2 : valOrNull(metaFormData.c2Indi),
        c1p : metaFormData.c1Params,
        blp : valOrNull(metaFormData.blineParams),
        exp : valOrNull(metaFormData.exitParams),
        vlp : valOrNull(metaFormData.volParams),
        c2p : valOrNull(metaFormData.c2Params),
    };
    //needs more front or backend validation of input data as to not destroy 
    //database/get errors
    console.log(Object.values(val).join(', '))
    return Object.values(val);
}

function sortTradeData(tradeData) {
    const vals = {
        tid : tradeData.testId,
        dt : tradeData.entryDate,
        ep : tradeData.entryPrice,
        atr : tradeData.atr,
        ed : tradeData.exitDate,
        exp : tradeData.exitPrice,
        ls : tradeData.lorS,
        tp : tradeData.hitTp,
        sl : tradeData.hitSl,
        hp : tradeData.hiPrice,
        lp : tradeData.loPrice,
    };
    //change bool strings to tinyint mysql bool datatype
    vals.sl = vals.sl == 'true' ? '1' : '0';
    vals.tp = vals.tp == 'true' ? '1' : '0';

    console.log(Object.values(vals).join(', '))
    console.log('pre-break test');
    return Object.values(vals);
};

module.exports = {
    sortMetaFormData,
    sortTradeData    
}