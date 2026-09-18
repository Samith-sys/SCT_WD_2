const display = document.getElementById("display");

const startBtn = document.getElementById("startBtn");
const startIcon = document.getElementById("startIcon");
const startText = document.getElementById("startText");

const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");

const statusText = document.getElementById("statusText");

const lapsContainer = document.getElementById("lapsContainer");
const emptyState = document.getElementById("emptyState");

const lapCount = document.getElementById("lapCount");


// ===============================
// VARIABLES
// ===============================

let startTime = 0;
let elapsedTime = 0;

let timerInterval = null;

let running = false;

let lastLapTime = 0;

let lapNumber = 0;


// ===============================
// FORMAT TIME
// ===============================

function formatTime(milliseconds) {

    const hours = Math.floor(milliseconds / 3600000);

    const minutes = Math.floor(
        (milliseconds % 3600000) / 60000
    );

    const seconds = Math.floor(
        (milliseconds % 60000) / 1000
    );

    const centiseconds = Math.floor(
        (milliseconds % 1000) / 10
    );


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(centiseconds).padStart(2, "0")
    );
}


// ===============================
// UPDATE DISPLAY
// ===============================

function updateDisplay() {

    const currentTime =
        elapsedTime +
        (running ? Date.now() - startTime : 0);

    display.textContent = formatTime(currentTime);

}


// ===============================
// START / PAUSE
// ===============================

function toggleTimer() {

    if (!running) {

        startTime = Date.now();

        running = true;

        statusText.textContent = "RUNNING";

        startIcon.textContent = "Ⅱ";

        startText.textContent = "PAUSE";

        startBtn.classList.add("pause");

        timerInterval = setInterval(
            updateDisplay,
            10
        );

    } else {

        elapsedTime += Date.now() - startTime;

        running = false;

        clearInterval(timerInterval);

        statusText.textContent = "PAUSED";

        startIcon.textContent = "▶";

        startText.textContent = "RESUME";

        startBtn.classList.remove("pause");

        updateDisplay();
    }

}


// ===============================
// RESET
// ===============================

function resetTimer() {

    clearInterval(timerInterval);

    running = false;

    startTime = 0;

    elapsedTime = 0;

    lastLapTime = 0;

    lapNumber = 0;

    display.textContent = "00:00:00.00";

    statusText.textContent = "READY";

    startIcon.textContent = "▶";

    startText.textContent = "START";

    startBtn.classList.remove("pause");

    lapsContainer.innerHTML = "";

    lapsContainer.appendChild(emptyState);

    emptyState.style.display = "block";

    lapCount.textContent = "0";
}


// ===============================
// RECORD LAP
// ===============================

function recordLap() {

    if (!running && elapsedTime === 0) {
        return;
    }

    let currentElapsed;

    if (running) {

        currentElapsed =
            elapsedTime +
            (Date.now() - startTime);

    } else {

        currentElapsed = elapsedTime;

    }


    const currentLap =
        currentElapsed - lastLapTime;


    lastLapTime = currentElapsed;

    lapNumber++;

    emptyState.style.display = "none";

    const row = document.createElement("div");

    row.className = "lap-row";

    row.innerHTML = `
        <span class="lap-number">
            LAP ${String(lapNumber).padStart(2, "0")}
        </span>

        <span class="lap-label">
            INTERVAL
        </span>

        <span class="lap-time">
            ${formatTime(currentLap)}
        </span>
    `;


    lapsContainer.insertBefore(
        row,
        lapsContainer.firstChild
    );

    lapCount.textContent = lapNumber;
}


// ===============================
// BUTTON EVENTS
// ===============================

startBtn.addEventListener(
    "click",
    toggleTimer
);

resetBtn.addEventListener(
    "click",
    resetTimer
);

lapBtn.addEventListener(
    "click",
    recordLap
);


// ===============================
// KEYBOARD SHORTCUTS
// ===============================

document.addEventListener(
    "keydown",
    function(event) {

        // SPACE = START / PAUSE
        if (event.code === "Space") {

            event.preventDefault();

            toggleTimer();
        }


        // L = LAP
        if (
            event.key.toLowerCase() === "l"
        ) {

            recordLap();
        }


        // R = RESET
        if (
            event.key.toLowerCase() === "r"
        ) {

            resetTimer();
        }

    }
);
