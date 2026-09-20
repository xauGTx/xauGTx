function money(value) {
    return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


/* =========================
   RISK CALCULATOR
========================= */

function calculateRisk() {

    const balance = Number(document.getElementById("riskBalance").value);
    const riskPercent = Number(document.getElementById("riskPercent").value);
    const entry = Number(document.getElementById("riskEntry").value);
    const sl = Number(document.getElementById("riskSL").value);

    const result = document.getElementById("riskResult");

    if (
        balance <= 0 ||
        riskPercent <= 0 ||
        entry <= 0 ||
        sl <= 0
    ) {
        result.innerHTML = "Please enter valid values.";
        return;
    }

    const riskAmount = balance * riskPercent / 100;
    const distance = Math.abs(entry - sl);

    if (distance <= 0) {
        result.innerHTML = "Entry and Stop Loss cannot be the same.";
        return;
    }

    /*
       Educational XAUUSD estimate:
       estimated lot = risk amount / (price distance × contract size)
       Assumes contract size = 100.
       Broker specifications may differ.
    */

    const contractSize = 100;
    const estimatedLot =
        riskAmount / (distance * contractSize);

    result.innerHTML = `
        <div>Risk Amount:
            <strong>$${money(riskAmount)}</strong>
        </div>

        <div>Stop Distance:
            <strong>${distance.toFixed(2)}</strong>
        </div>

        <div>Estimated Position Size:
            <strong>${estimatedLot.toFixed(3)} lot</strong>
        </div>

        <small>
            Educational estimate only. Verify your broker's
            contract specification before trading.
        </small>
    `;
}


/* =========================
   RISK REWARD
========================= */

function calculateRR() {

    const direction =
        document.getElementById("rrDirection").value;

    const entry =
        Number(document.getElementById("rrEntry").value);

    const sl =
        Number(document.getElementById("rrSL").value);

    const tp =
        Number(document.getElementById("rrTP").value);

    const result =
        document.getElementById("rrResult");

    if (
        entry <= 0 ||
        sl <= 0 ||
        tp <= 0
    ) {
        result.innerHTML = "Please enter valid prices.";
        return;
    }

    let risk;
    let reward;

    if (direction === "buy") {

        risk = entry - sl;
        reward = tp - entry;

    } else {

        risk = sl - entry;
        reward = entry - tp;
    }

    if (risk <= 0) {
        result.innerHTML =
            "Invalid Stop Loss for this direction.";
        return;
    }

    if (reward <= 0) {
        result.innerHTML =
            "Invalid Take Profit for this direction.";
        return;
    }

    const rr = reward / risk;

    result.innerHTML = `
        <div>Risk Distance:
            <strong>${risk.toFixed(2)}</strong>
        </div>

        <div>Reward Distance:
            <strong>${reward.toFixed(2)}</strong>
        </div>

        <div>Risk / Reward:
            <strong>1 : ${rr.toFixed(2)}</strong>
        </div>
    `;
}


/* =========================
   PRICE DISTANCE
========================= */

function calculatePriceDistance() {

    const start =
        Number(document.getElementById("priceStart").value);

    const end =
        Number(document.getElementById("priceEnd").value);

    const result =
        document.getElementById("priceResult");

    if (start <= 0 || end <= 0) {
        result.innerHTML = "Please enter valid prices.";
        return;
    }

    const distance = Math.abs(end - start);

    const percentage =
        (distance / start) * 100;

    result.innerHTML = `
        <div>Price Distance:
            <strong>${distance.toFixed(2)}</strong>
        </div>

        <div>Percentage Movement:
            <strong>${percentage.toFixed(3)}%</strong>
        </div>

        <small>
            This is price distance, not a universal broker pip/tick
            calculation.
        </small>
    `;
}


/* =========================
   PROFIT / LOSS
========================= */

function calculatePL() {

    const direction =
        document.getElementById("plDirection").value;

    const entry =
        Number(document.getElementById("plEntry").value);

    const exit =
        Number(document.getElementById("plExit").value);

    const lot =
        Number(document.getElementById("plLot").value);

    const contract =
        Number(document.getElementById("plContract").value);

    const result =
        document.getElementById("plResult");

    if (
        entry <= 0 ||
        exit <= 0 ||
        lot <= 0 ||
        contract <= 0
    ) {
        result.innerHTML = "Please enter valid values.";
        return;
    }

    let priceDifference;

    if (direction === "buy") {
        priceDifference = exit - entry;
    } else {
        priceDifference = entry - exit;
    }

    const profitLoss =
        priceDifference * lot * contract;

    const percentage =
        (Math.abs(priceDifference) / entry) * 100;

    const label =
        profitLoss >= 0 ? "Estimated Profit" : "Estimated Loss";

    result.innerHTML = `
        <div>${label}:
            <strong>$${money(profitLoss)}</strong>
        </div>

        <div>Price Movement:
            <strong>${priceDifference.toFixed(2)}</strong>
        </div>

        <div>Price Movement %:
            <strong>${percentage.toFixed(3)}%</strong>
        </div>

        <small>
            Estimated result based on the contract size entered.
            Actual broker P/L can differ due to spread, commission,
            swap and contract specifications.
        </small>
    `;
}


/* =========================
   TRADING JOURNAL
========================= */

function getJournal() {

    try {

        return JSON.parse(
            localStorage.getItem("xauusdJournal") || "[]"
        );

    } catch {

        return [];
    }
}


function saveJournal() {

    const trade = {

        date:
            document.getElementById("journalDate").value,

        symbol:
            document.getElementById("journalSymbol").value,

        direction:
            document.getElementById("journalDirection").value,

        timeframe:
            document.getElementById("journalTF").value,

        entry:
            document.getElementById("journalEntry").value,

        sl:
            document.getElementById("journalSL").value,

        tp:
            document.getElementById("journalTP").value,

        result:
            document.getElementById("journalResult").value,

        notes:
            document.getElementById("journalNotes").value,

        createdAt:
            new Date().toISOString()
    };


    if (!trade.date) {
        trade.date =
            new Date().toISOString().split("T")[0];
    }


    const journal = getJournal();

    journal.unshift(trade);

    localStorage.setItem(
        "xauusdJournal",
        JSON.stringify(journal)
    );


    document.getElementById("journalMessage").innerHTML =
        "✅ Trade saved successfully.";

    document.getElementById("journalEntry").value = "";
    document.getElementById("journalSL").value = "";
    document.getElementById("journalTP").value = "";
    document.getElementById("journalResult").value = "";
    document.getElementById("journalNotes").value = "";

    renderJournal();
}


function renderJournal() {

    const journal = getJournal();

    const list =
        document.getElementById("journalList");

    if (!journal.length) {

        list.innerHTML =
            `<div class="empty">No trades saved yet.</div>`;

        return;
    }


    list.innerHTML = journal.map((trade, index) => {

        const resultValue =
            Number(trade.result || 0);

        return `
            <div class="journal-item">

                <h4>
                    ${escapeHTML(trade.direction)}
                    ${escapeHTML(trade.symbol)}
                    — ${escapeHTML(trade.timeframe)}
                </h4>

                <p>
                    Date:
                    ${escapeHTML(trade.date || "-")}
                </p>

                <p>
                    Entry:
                    ${escapeHTML(trade.entry || "-")}
                    |
                    SL:
                    ${escapeHTML(trade.sl || "-")}
                    |
                    TP:
                    ${escapeHTML(trade.tp || "-")}
                </p>

                <p>
                    Result:
                    <strong>
                        $${money(resultValue)}
                    </strong>
                </p>

                <p>
                    Notes:
                    ${escapeHTML(trade.notes || "-")}
                </p>

                <button
                    class="btn danger"
                    onclick="deleteTrade(${index})"
                    style="margin-top:12px"
                >
                    Delete
                </button>

            </div>
        `;

    }).join("");
}


function deleteTrade(index) {

    const journal = getJournal();

    journal.splice(index, 1);

    localStorage.setItem(
        "xauusdJournal",
        JSON.stringify(journal)
    );

    renderJournal();
}


function clearJournal() {

    const ok =
        confirm("Delete all saved trades?");

    if (!ok) return;

    localStorage.removeItem("xauusdJournal");

    renderJournal();

    document.getElementById("journalMessage").innerHTML =
        "Journal cleared.";
}


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================
   DEFAULT DATE
========================= */

function setDefaultDate() {

    const dateInput =
        document.getElementById("journalDate");

    if (!dateInput.value) {

        dateInput.value =
            new Date()
                .toISOString()
                .split("T")[0];
    }
}


/* =========================
   STARTUP
========================= */

document.addEventListener("DOMContentLoaded", () => {

    setDefaultDate();

    renderJournal();

    calculateRisk();

    calculateRR();

    calculatePriceDistance();

    calculatePL();
});
