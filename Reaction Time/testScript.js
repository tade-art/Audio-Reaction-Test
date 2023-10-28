/**
 * Things to fix
 * - If player holds down spacebar, then time is inaccurate
 * - Probably something else i missed out tbh
 * code is almost ready to be launched for testing, just double check it yourselves :D
 */
const experimentState = {
  times: [],
  maxTrials: 3,
  randomDelay: -1,
  started: false,
  ended: false,
  stimulusWait: false,
  stimulusShown: false,
  stimulusStartedAt: -1,
  btnDisabled: false,
};

const btn = document.querySelector("#btn");
const audio = new Audio("sound.mp3");

const startTest = function () {
  if (experimentState.times.length < experimentState.maxTrials) {
    experimentState.stimulusShown = false; 
    scheduleSound();
  } 
  else {
    experimentState.stimulusShown = false;
    endExperiment();
  }
};

const endExperiment = function () {
  experimentState.ended = true;
  experimentState.btnDisabled = false;
  btn.classList.toggle("button-enabled");
  btn.classList.toggle("button-disabled");
};

const scheduleSound = function () {
  experimentState.stimulusWait = true;
  const randomDelay = Math.floor(Math.random() * 4 + 2);
  experimentState.randomDelay = window.setTimeout(playSound, randomDelay * 1000);
};

const playSound = function () {
  experimentState.stimulusStartedAt = Date.now();
  audio.play();
  experimentState.stimulusWait = false;
  experimentState.stimulusShown = true;
};

const logReaction = function () {
  let userReactedAt = Date.now();
  let deltaTime = userReactedAt - experimentState.stimulusStartedAt;
  experimentState.times.push(deltaTime);
  document.querySelector("#time").textContent = deltaTime + " ms";
};

const userReaction = function () {
  if (!experimentState.started) return;
  if (experimentState.stimulusWait) return;
  if (experimentState.stimulusShown) {
    logReaction();
    startTest();
  }
};

const startExperiment = function () {
  document.querySelector("#instructions").textContent = "";
  experimentState.started = true;
  window.addEventListener("keypress", onKey);
  startTest();
};

const btnAction = function () {
  if (experimentState.btnDisabled) return;
  if (!experimentState.ended) {
    experimentState.btnDisabled = true;
    btn.classList.toggle("button-enabled");
    btn.classList.toggle("button-disabled");
  }
  if (!experimentState.started) {
    startExperiment();
  } else {
    if (experimentState.ended) {
      const stats = computeStatistics(experimentState.times);
      document.querySelector("#time").textContent = [""];
      document.querySelector("#count").textContent = ["Count:"+stats.cnt];
      document.querySelector("#mean").textContent = ["Mean:" + stats.mean.toFixed(2)+"ms"];
      document.querySelector("#sd").textContent = ["SD:" + stats.sd.toFixed(2) + "ms"];
    } 
  }
};

const computeStatistics = function (timeArr) {
  //Mean = sum(x)/cnt(x)
  const sums = timeArr.reduce((acc, num) => acc + num, 0);
  const meanDeltaTime = sums / timeArr.length;
  //standard deviation is sqrt(sum(x-mean)^2/cnt(x))
  const squaredDiffs = timeArr.reduce( (acc, num) => (num - meanDeltaTime) ** 2 + acc, 0);
  const standardDeviationTime = Math.sqrt(squaredDiffs / timeArr.length);
  return {
    sd: standardDeviationTime,
    mean: meanDeltaTime,
    cnt: timeArr.length,
  };
};

const onKey = function (evt) {
  switch (evt.which || evt.charCode || evt.keyCode) {
    case 32: //ASCII FOR SPACE
      userReaction();
      break;
  }
};
btn.addEventListener("click", btnAction);