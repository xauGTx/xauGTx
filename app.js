function calculateRisk() {

    const balance = Number(document.getElementById("balance").value);
    const riskPercent = Number(document.getElementById("risk").value);
    const entry = Number(document.getElementById("entry").value);
    const sl = Number(document.getElementById("sl").value);
    const tp = Number(document.getElementById("tp").value);

    if (balance <= 0 || riskPercent <= 0) {
        alert("Please enter valid balance and risk.");
        return;
    }

    const riskMoney = balance * riskPercent / 100;

    const stopDistance = Math.abs(entry - sl);
    const targetDistance = Math.abs(tp - entry);

    if (stopDistance === 0) {
        alert("Entry and Stop Loss cannot be the same.");
        return;
    }

    const rr = targetDistance / stopDistance;

    /*
       Educational simplified position-size calculation.
       Actual XAUUSD contract specifications vary by broker.
    */

    const positionSize = riskMoney / stopDistance;

    document.getElementById("riskAmount").textContent =
        "$" + riskMoney.toFixed(2);

    document.getElementById("stopDistance").textContent =
        stopDistance.toFixed(2);

    document.getElementById("targetDistance").textContent =
        targetDistance.toFixed(2);

    document.getElementById("riskReward").textContent =
        "1 : " + rr.toFixed(2);

    document.getElementById("positionSize").textContent =
        positionSize.toFixed(2);
}


function calculateRR() {

    const risk =
        Number(document.getElementById("rrRisk").value);

    const reward =
        Number(document.getElementById("rrReward").value);

    if (risk <= 0 || reward <= 0) {
        alert("Enter valid numbers.");
        return;
    }

    const ratio = reward / risk;

    document.getElementById("rrResult").textContent =
        "1 : " + ratio.toFixed(2);
}


function calculatePip() {

    const entry =
        Number(document.getElementById("pipEntry").value);

    const exit =
        Number(document.getElementById("pipExit").value);

    const lot =
        Number(document.getElementById("pipLot").value);

    const movement = Math.abs(exit - entry);

    /*
       Simplified educational estimate.
       Broker contract specifications can differ.
    */

    const estimatedPL = movement * lot * 100;

    document.getElementById("priceMovement").textContent =
        movement.toFixed(2);

    document.getElementById("estimatedPL").textContent =
        "$" + estimatedPL.toFixed(2);
}


function calculatePL() {

    const entry =
        Number(document.getElementById("plEntry").value);

    const exit =
        Number(document.getElementById("plExit").value);

    const lot =
        Number(document.getElementById("plLot").value);

    const difference = exit - entry;

    const profit = difference * lot * 100;

    document.getElementById("plResult").textContent =
        "$" + profit.toFixed(2);
}


function saveJournal() {

    const journal = {

        date: document.getElementById("jDate").value,

        direction:
            document.getElementById("jDirection").value,

        timeframe:
            document.getElementById("jTF").value,

        entry:
            document.getElementById("jEntry").value,

        sl:
            document.getElementById("jSL").value,

        tp:
            document.getElementById("jTP").value,

        notes:
            document.getElementById("jNotes").value

    };

    localStorage.setItem(
        "xauusd_journal",
        JSON.stringify(journal)
    );

    document.getElementById("journalStatus").textContent =
        "✓ Journal saved on this browser.";
}


calculateRisk();
