/*
  This is your site JavaScript code - you can add interactivity!
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

const experimentState = {
  experimentActive: false,
  testActive: false,
  lastTimeColorChanged: -1,
  times: [],
  timeoutId: -1,
};

const startExperiment = function () {
  //start the experiment, remove the data stats
  experimentState.experimentActive = true; //indicate start of experiment
  document.querySelector("#time").textContent = ""; //clear the values from prior runs
  document.querySelector("#count").textContent = "";
  document.querySelector("#mean").textContent = "";
  document.querySelector("#sd").textContent = "";
  document.querySelector("#time").textContent =
    "Press 'SPACE' when color changes! Press 'a' for results!";
  //start the first trial
  startTrial();
};

const startTrial = function () {
  changeTextColor("black");
  const randomDelay = Math.floor(Math.random() * 4 + 2); // 2 - 5s
  experimentState.timeoutId = window.setTimeout(showStimulus,randomDelay * 1000); //setTimeout runs in milliseconds
  console.info("INFO: Trial", experimentState.times.length," started. Random delay:",randomDelay);
};

const showStimulus = function () {
  console.info("INFO: Stimulus shown.");
  experimentState.testActive = true;
  changeTextColor("red");
};

const stopTest = function () {
  console.info("INFO: User reaction captured.");
  let currTime = Date.now();
  let deltaTime = currTime - experimentState.lastTimeColorChanged;
  experimentState.times.push(deltaTime);
  document.querySelector("#time").textContent ="Time: "+ deltaTime + " ms";
  experimentState.testActive = false;
  startTrial();
};

let arr=[];

const stopExperiment = function () {
  clearTimeout(experimentState.timeoutId); //stop the timer
  changeTextColor("gray"); //indicate stop
  experimentState.testActive = false;

  let stats = computeStatistics(experimentState.times);

  document.querySelector("#count").textContent = "Count: " + stats.cnt;
  document.querySelector("#mean").textContent =
    "Mean: " + stats.mean.toFixed(2) + "ms";
  document.querySelector("#sd").textContent =
    "SD: " + stats.sd.toFixed(2) + "ms";
  document.querySelector("#instruction").innerHTML = "Press SPACE to start!";
  arr = experimentState.times;
  experimentState.times = [];
  experimentState.experimentActive = false;
};

const computeStatistics = function (timeArr) {
  //to get mean, get sum of all trials and divide by number of trials m = sum(x)/cnt(x)
  const sums = timeArr.reduce((acc, num) => acc + num, 0);
  const meanDeltaTime = sums / timeArr.length;

  //standard deviation is  sqrt(sum(x-mean)^2/cnt(x))
  const squaredDiffs = timeArr.reduce(
    (acc, num) => (num - meanDeltaTime) ** 2 + acc,
    0
  );
  const standardDeviationTime = Math.sqrt(squaredDiffs / timeArr.length);

  return {
    sd: standardDeviationTime,
    mean: meanDeltaTime,
    cnt: timeArr.length,
  };
};

function changeTextColor(newColor) {
  const hndStimulus = document.querySelector("#text");
  hndStimulus.style.color = newColor;
  hndStimulus.style.backgroundColor = newColor;
  experimentState.lastTimeColorChanged = Date.now();
}

const onKey = function (evt) {
  if (evt == null) {
    evt = window.event;
  }
  switch (evt.which || evt.charCode || evt.keyCode) {
    case 32: //space
      if (!experimentState.experimentActive) {
        startExperiment();
      } else {
        if (experimentState.testActive) {
          stopTest();
        }
      }
      break;
    case 65: //a
      if (experimentState.experimentActive) {
        stopExperiment();
      }
      break;
    //if here, it is not handled, you can extend as needed
    default:
      console.warn(
        "TBD?: Key down, unhandled",
        evt.which,
        evt.charCode,
        evt.keyCode
      );
  }
};

window.addEventListener("keydown", onKey);
