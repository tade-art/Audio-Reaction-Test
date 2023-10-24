/**
 * Things to fix
 * - Sound isn't played randomly, needs to be fixed
 * - The reaction time displayed is incorrect
 * - StopExperiment isn't working as intended (needs to show results and stop sound playing)
 * - Probably something else i missed out tbh
 * vry rough version of the code, just needs a few tweaks and then replicated for the randomised volume and freq version and then should be set for testing
 */



console.log("Hello 🌎");

let arr=[];

//A collection of objects which is used to track the status of the experiment
const experimentState = {
  experimentActive: false,
  testActive: false,
  lastAudioTimePlayed: -1,
  times: [],
  audioTimeoutId: -1,
};

//This function is called when SPACE is pressed or reset
const startExperiment = function () {
  experimentState.experimentActive = true;
  document.querySelector("#time").textContent = "";
  document.querySelector("#count").textContent = "";
  document.querySelector("#mean").textContent = "";
  document.querySelector("#sd").textContent = "";
  document.querySelector("#time").textContent =
    "Press 'SPACE' to start the audio test! Press 'a' for results!";
    playAudioStimulus();    //Plays the audio queue
};

const randomDelay = Math.floor(Math.random() * 4 + 2); // Plays a sound between 2 - 5s (needs to be used somewhere...)

//Function which loads and plays the audio file
const playAudioStimulus = function () {
  const audio = new Audio("sound.mp3");
  audio.play();
  experimentState.audioTimeoutId = setTimeout(() => stopTest(), 1500); //Needs adjusting (Incorrect gaps)
};

const stopTest = function () {
  let currTime = Date.now();
  let deltaTime = currTime - experimentState.lastAudioTimePlayed;
  experimentState.times.push(deltaTime);
  document.querySelector("#time").textContent = "Reaction Time: " + deltaTime + " ms";
  experimentState.testActive = false;
  playAudioStimulus();
};

const stopExperiment = function () {
  clearTimeout(experimentState.timeoutId); //stop the timer
  experimentState.testActive = false;
  let stats = computeStatistics(experimentState.times);
  document.querySelector("#count").textContent = "Count: " + stats.cnt;
  document.querySelector("#mean").textContent = "Mean: " + stats.mean.toFixed(2) + "ms";
  document.querySelector("#sd").textContent ="SD: " + stats.sd.toFixed(2) + "ms";
  document.querySelector("#instruction").innerHTML = "Press SPACE to start!";
  arr = experimentState.times;
  experimentState.times = [];
  experimentState.experimentActive = false;
};

//Function which is full of formulas needed to calculate everything (used from the template)
const computeStatistics = function (timeArr) {
  const sums = timeArr.reduce((acc, num) => acc + num, 0);
  const meanDeltaTime = sums / timeArr.length;
  const squaredDiffs = timeArr.reduce((acc, num) => (num - meanDeltaTime) ** 2 + acc, 0);
  const standardDeviationTime = Math.sqrt(squaredDiffs / timeArr.length);

  return {
    sd: standardDeviationTime,
    mean: meanDeltaTime,
    cnt: timeArr.length,
  };
};

//Function which is ran every single time a key is pressed down (keys that are coded anyways)
const onKey = function (evt) {
  if (evt == null) {
    evt = window.event;
  }
  switch (evt.which || evt.charCode || evt.keyCode) {
    case 32: // ASCII for SPACE bar
      if (!experimentState.experimentActive) {startExperiment();} 
      else { if (experimentState.testActive) {stopTest();} }
      break;
    
      case 65: // ASCII for a (IN LOWERCASE)
      if (experimentState.experimentActive) {stopExperiment();}
      break;

      //If you need anything more, extend it here
    
    default:
      console.warn(
        "TBD?: Key down, unhandled",
        evt.which,
        evt.charCode,
        evt.keyCode
      );
  }
};

//Adding the events to the window so that a function is ran upon key press
window.addEventListener("keydown", onKey);
