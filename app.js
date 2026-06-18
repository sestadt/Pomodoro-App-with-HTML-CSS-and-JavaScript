const bells = document.getElementById('bells');
if (bells) bells.volume = 0.8;
const startBtn = document.querySelector(".btn-start");
const pauseBtn = document.querySelector(".btn-pause");
const resetBtn = document.querySelector(".btn-reset");
const minuteSpan = document.querySelector(".minutes");
const secondSpan = document.querySelector(".seconds");

let myInterval;
let remainingSeconds = parseDisplayTime();
let originalSeconds = remainingSeconds;
let timerState = "ready";

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    minuteSpan.textContent = String(minutes);
    secondSpan.textContent = String(secs).padStart(2, "0");
}

function startTimer() {
    if (timerState === "running") {
        alert("Session has already started. Click pause to pause the timer or reset to start over.");
            return;
        }

    if (timerState === "ready") {
        remainingSeconds = parseDisplayTime();
        originalSeconds = remainingSeconds;
    }

    timerState = "running";
    minuteSpan.contentEditable = "false";
    secondSpan.contentEditable = "false";

    myInterval = setInterval(() => {
        remainingSeconds -= 1;
        formatTime(remainingSeconds);

        if (remainingSeconds <= 0) {
            clearInterval(myInterval);
            try {
                bells.pause();
                bells.currentTime = 0;
                bells.play();
            } catch (e) {
                console.warn('Bell playback failed', e);
            }
            timerState = "ready";
            minuteSpan.contentEditable = "true";
            secondSpan.contentEditable = "true";
            startBtn.textContent = "start";
            pauseBtn.textContent = "pause";
        }
    }, 1000);
}

function pauseTimer() {
    if (timerState !== "running") return;
    clearInterval(myInterval);
    timerState = "paused";
}

function resetTimer() {
    clearInterval(myInterval);
    timerState = "ready";
    remainingSeconds = originalSeconds;
    formatTime(originalSeconds);
    minuteSpan.contentEditable = "true";
    secondSpan.contentEditable = "true";
}

startBtn.addEventListener("click", startTimer);

pauseBtn.addEventListener("click", () => {
    if (timerState === "paused") {
        startTimer();
    } else {
        pauseTimer();
    }
});

resetBtn.addEventListener("click", resetTimer);

function parseDisplayTime() {
    const minutes = Number(minuteSpan.textContent.trim()) || 0;
    const seconds = Number(secondSpan.textContent.trim()) || 0;
    return minutes * 60 + seconds;
}

minuteSpan.addEventListener("blur", () => {
    originalSeconds = parseDisplayTime();
});

secondSpan.addEventListener("blur", () => {
    originalSeconds = parseDisplayTime();
});