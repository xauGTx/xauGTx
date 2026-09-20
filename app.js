"use strict";

function num(id){
    return Number(document.getElementById(id).value) || 0;
}

function money(value){
    return "$" + Number(value).toFixed(2);
}


/* =========================
   RISK CALCULATOR
========================= */

function calculateRisk(){

    const balance = num("riskBalance");
    const riskPercent = num("riskPercent");
    const entry = num("riskEntry");
    const sl = num("riskSL");
    const contract = num("riskContract");

    const riskAmount = balance * riskPercent / 100;
    const distance = Math.abs(entry - sl);

    if(distance <= 0 || contract <= 0){
        document.getElementById("riskResult").innerHTML =
            "Please enter valid values.";
        return;
    }

    const lot = riskAmount / (distance * contract);

    document.getElementById("riskResult").innerHTML =
        "Risk Amount: " + money(riskAmount) +
        "<br>SL Distance: " + distance.toFixed(2) +
        "<br>Estimated Lot: " + lot.toFixed(4);
}


/* =========================
   RISK REWARD
========================= */

function calculateRR(){

    const entry = num("rrEntry");
    const sl = num("rrSL");
    const tp = num("rrTP");

    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);

    if(risk <= 0){
        document.getElementById("rrResult").innerHTML =
            "Invalid stop-loss distance.";
        return;
    }

    const rr = reward / risk;

    document.getElementById("rrResult").innerHTML =
        "Risk: " + risk.toFixed(2) +
        "<br>Reward: " + reward.toFixed(2) +
        "<br>Risk / Reward: 1:" + rr.toFixed(2);
}


/* =========================
   DISTANCE
========================= */

function calculateDistance(){

    const entry = num("distEntry");
    const target = num("distTarget");

    const distance = Math.abs(target - entry);

    document.getElementById("distResult").innerHTML =
        "Price Distance: " + distance.toFixed(2);
}


/* =========================
   PROFIT LOSS
========================= */

function calculatePL(){

    const direction =
        document.getElementById("plDirection").value;

    const entry = num("plEntry");
    const exit = num("plExit");
    const lot = num("plLot");
    const contract = num("plContract");

    let difference;

    if(direction === "BUY"){
        difference = exit - entry;
    }else{
        difference = entry - exit;
    }

    const pnl = difference * lot * contract;

    document.getElementById("plResult").innerHTML =
        "Estimated P/L: " + money(pnl);
}


/* =========================
   POSITION SIZE
========================= */

function calculatePosition(){

    const balance = num("posBalance");
    const riskPercent = num("posRisk");
    const distance = num("posDistance");
    const contract = num("posContract");

    const riskAmount = balance * riskPercent / 100;

    if(distance <= 0 || contract <= 0){
        document.getElementById("posResult").innerHTML =
            "Invalid values.";
        return;
    }

    const lot =
        riskAmount / (distance * contract);

    document.getElementById("posResult").innerHTML =
        "Risk Amount: " + money(riskAmount) +
        "<br>Estimated Lot: " + lot.toFixed(4);
}


/* =========================
   BREAK EVEN
========================= */

function calculateBE(){

    const entry = num("beEntry");
    const spread = num("beSpread");
    const commission = num("beCommission");

    const buyBE =
        entry + spread + commission;

    const sellBE =
        entry - spread - commission;

    document.getElementById("beResult").innerHTML =
        "BUY BE: " + buyBE.toFixed(2) +
        "<br>SELL BE: " + sellBE.toFixed(2);
}


/* =========================
   JOURNAL STORAGE
========================= */

function getJournal(){

    try{

        return JSON.parse(
            localStorage.getItem("xauusdJournal") || "[]"
        );

    }catch(error){

        return [];
    }
}


function saveJournal(data){

    localStorage.setItem(
        "xauusdJournal",
        JSON.stringify(data)
    );
}


/* =========================
   ADD TRADE
========================= */

function addTrade(){

    const trade = {

        id: Date.now(),

        date:
            document.getElementById("tradeDate").value,

        symbol:
            document.getElementById("tradeSymbol").value,

        side:
            document.getElementById("tradeSide").value,

        entry:
            num("tradeEntry"),

        sl:
            num("tradeSL"),

        tp:
            num("tradeTP"),

        result:
            num("tradeResult"),

        reason:
            document.getElementById("tradeReason").value

    };


    if(!trade.date){
        alert("Please select a date.");
        return;
    }


    const journal = getJournal();

    journal.push(trade);

    saveJournal(journal);

    document.getElementById("tradeEntry").value = "";
    document.getElementById("tradeSL").value = "";
    document.getElementById("tradeTP").value = "";
    document.getElementById("tradeResult").value = "";
    document.getElementById("tradeReason").value = "";

    renderJournal();
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value){

    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}


/* =========================
   DELETE
========================= */

function deleteTrade(id){

    const journal = getJournal();

    const updated =
        journal.filter(trade => trade.id !== id);

    saveJournal(updated);

    renderJournal();
}


/* =========================
   CLEAR
========================= */

function clearJournal(){

    if(!confirm("Delete all journal trades?")){
        return;
    }

    localStorage.removeItem("xauusdJournal");

    renderJournal();
}


/* =========================
   RENDER JOURNAL
========================= */

function renderJournal(){

    const journal = getJournal();

    const body =
        document.getElementById("journalBody");

    body.innerHTML = "";


    let wins = 0;
    let losses = 0;
    let total = 0;


    journal.forEach(trade => {

        if(trade.result > 0){
            wins++;
        }

        if(trade.result < 0){
            losses++;
        }

        total += Number(trade.result) || 0;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHTML(trade.date)}</td>

            <td>${escapeHTML(trade.symbol)}</td>

            <td>${escapeHTML(trade.side)}</td>

            <td>${Number(trade.entry).toFixed(2)}</td>

            <td>${Number(trade.sl).toFixed(2)}</td>

            <td>${Number(trade.tp).toFixed(2)}</td>

            <td>${money(trade.result)}</td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteTrade(${trade.id})">
                    Delete
                </button>
            </td>

        `;

        body.appendChild(row);

    });


    const totalTrades = journal.length;

    const winRate =
        totalTrades > 0
        ? (wins / totalTrades * 100)
        : 0;


    document.getElementById("totalTrades").textContent =
        totalTrades;

    document.getElementById("winTrades").textContent =
        wins;

    document.getElementById("lossTrades").textContent =
        losses;

    document.getElementById("winRate").textContent =
        winRate.toFixed(1) + "%";

    document.getElementById("totalPL").textContent =
        money(total);
}


/* =========================
   STARTUP
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const date =
        document.getElementById("tradeDate");

    if(date){

        date.value =
            new Date().toISOString().split("T")[0];
    }


    renderJournal();

    calculateRisk();
    calculateRR();
    calculateDistance();
    calculatePL();
    calculatePosition();
    calculateBE();

});
