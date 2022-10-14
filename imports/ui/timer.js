import { template } from "lodash";
import "./timer.html";

var timerAmount = 5;

Template.timer.helpers ( {
  sessionAmount (){
    return timerAmount;
  }
});

Template.study.events({
  "click #beginStudyButton"() {
    let duration = timerAmount * 60;
    let display = document.getElementById("timerDisplay");

    document.getElementById("beginStudyButton").disabled = true;
    // work_message();

    var timer = duration;
    var minutes;
    var seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.innerHTML = (minutes + ":" + seconds);

      if (--timer < 0) {
        session_flag = session_flag * -1;
        if (session_flag !== -1) {
          clearInterval(countDownInterval);
          startTimer(session_time * 60, $("#timer_display"));

          timer = duration;
        } else {
          clearInterval(countDownInterval);
          startTimer(break_time * 60, $("#timer_display"));
        }
      }
    }, 1000);
  },
  "click #sessionPlusButton" () {
    var sessionAmountDisplay = document.getElementById("sessionAmount");
      timerAmount++;

      sessionAmountDisplay.innerHTML = timerAmount;
     
    
  },
  "click #sessionMinusButton" () {
    var sessionAmountDisplay = document.getElementById("sessionAmount");
    if (timerAmount > 0){
    timerAmount--;
  
  }
  sessionAmountDisplay.innerHTML = timerAmount;
},
});
