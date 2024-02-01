document.addEventListener("DOMContentLoaded", () => {
  let guessedNumbers = [[]];
  let availableSpace = 1;
  let po = 1;
  let num;
  let maxSol;
  let Number;
  let guessedCount = 0;
  let isDaily;
  let seed;
  const set = new Set();
  get_new_game(true);

  //TIMER

  var tim = document.getElementById('hms');
  var sec = 0;
  var min = 0;
  var hrs = 0;
  var t;

  function tick(){
      sec++;
      if (sec >= 60) {
          sec = 0;
          min++;
          if (min >= 60) {
              min = 0;
              hrs++;
          }
      }
  }
  function add() {
      tick();
      tim.textContent = (hrs > 9 ? hrs : "0" + hrs) + ":" + (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
      timer();
  }

  function timer() {
      t = setTimeout(add, 1000);
  }
  function stop() {
      clearTimeout(t);
  }
  
  function reset() {
    tim.textContent = "00:00:00";
    sec = 0; min = 0; hrs = 0;
    clearTimeout(t);
  }

//////////////////////////////////////////////

  const keys_1 = document.querySelectorAll(".number-row button");
  const keys_2 = document.querySelectorAll("op-row button");


  function getCurrentNumberArr() {
    const numberOfGuessedNumbers = guessedNumbers.length;
    return guessedNumbers[numberOfGuessedNumbers - 1];
  }

  function updateGuessedNumbers(Number) {
    const currentNumberArr = getCurrentNumberArr();

    if (currentNumberArr && currentNumberArr.length < 5) {
      if (currentNumberArr.length % 2 == 0 && Number != "+" && Number != "-") {
        currentNumberArr.push(Number);
        const availableSpaceEl = document.getElementById(String(availableSpace));
        availableSpace = availableSpace + 1;
        availableSpaceEl.textContent = Number;
      }
      else if (currentNumberArr.length % 2 == 1 && (Number == "+" || Number == "-")) {
        currentNumberArr.push(Number);
        const availableSpaceEl = document.getElementById(String(availableSpace));
        availableSpace = availableSpace + 1;
        availableSpaceEl.textContent = Number;
      }
    }
  }

  function getTileColor(Number, index) {
    const isCorrectNumber = Number.includes(Number);

    if (!isCorrectNumber) {
      return "rgb(58, 58, 60)";
    }

    const NumberInThatPosition = Number.charAt(index);
    const isCorrectPosition = Number === NumberInThatPosition;

    if (isCorrectPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  function handleSubmitNumber() {
    const currentNumberArr = getCurrentNumberArr();

    result = parseInt(currentNumberArr[0]);
    for (i = 1; i < currentNumberArr.length; ++i) {
        if (currentNumberArr[i] == "+") {
            result += parseInt(currentNumberArr[i+1]);
            ++i;
        }
        else if (currentNumberArr[i] == "-") {
          result -= parseInt(currentNumberArr[i+1]);
          ++i;
        }
    }

    let vec = new Array(3).fill(0);
    if (result === num) {
      vec[0] = parseInt(currentNumberArr[0]);
      let j = 1;
      for (let i = 1; i < currentNumberArr.length; ++i) {
        if (currentNumberArr[i] == "+") {
          vec[j] = parseInt(currentNumberArr[i+1]);
          ++i;
        }
        else if (currentNumberArr[i] == "-") {
          vec[j] = -parseInt(currentNumberArr[i+1]);
          ++i;
        }
        ++j;
      }

      vec.sort();
      let new_sol = [];
      new_sol += vec[0].toString();
      for (let i = 1; i < vec.length; ++i) {
        if (i < vec.length && vec[i] != 0) {
          if(vec[i] > 0) new_sol += "+" + vec[i].toString();
          else new_sol += "-" + (-vec[i]).toString();
        }
      }


      if (set.has(new_sol)) window.alert("This solution already exists!");
      else {
        ++guessedCount;
        set.add(new_sol);
        if (guessedCount==maxSol){
          if ( isDaily ) {
            markChallengeCompleted(seed);
            window.alert("Congratulations! You finished in " + tim.textContent +
                        "\nYou have finished " + getNumberOfCompletedDaily() +
                        " daily challenges!");
          }
          else {
            window.alert("Congratulations! You finished in " + tim.textContent);
          }
          reset();
          get_new_game();
        }
        let score = document.getElementById("score");
        score.textContent = guessedCount+"/"+maxSol;
        let sol = document.getElementById("solutions-found");
        if (po == 1){
          po = 0;
        }
        else {
          sol.textContent += " · ";
        }
        sol.textContent += currentNumberArr.join('');
        
      }

    } else {
      window.alert("It isn't the goal " + num + "! Your result is " + result + ". You have to practice more!");
    }
    for (let i = 1; i < 6; ++i) {
      handleDeleteNumber();
    }
  }

  function clear_solution() {
    let sol = document.getElementById("solutions-found");
    sol.textContent = " ";

  }


  function get_new_game(daily = false) {
    isDaily = daily;
    if (daily) {
      // Get the current date
      const currentDate = new Date();

      // Extract date components
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are zero-based
      const day = currentDate.getDate();
      // Create a seed based on date components
      seed = year * 10000 + month * 100 + day * 1;
    }
    else seed = Math.floor(Math.random()*100);
    console.log("Generated Seed:", seed);
    const rand = createSeededRandomGenerator(seed);

    timer();
    clear_solution();
    po = 1;
    
    let nums= [0];

    for (let i = 1; i < 10; ++i) {
        nums[i]=Math.floor(rand()*25) + 1;
        let j = 0;
        while (j < i) {
            if (nums[j]==nums[i])  {
                nums[i]=Math.floor(rand()*25) + 1;
                j = 0;
            } else ++j;
        }
    }
    let sols = new Array(50).fill(0);
    let sols_sum = new Array(50).fill(0);

    for (let i = 0; i < 10; ++i) {
        for (let j = i; j < 19; ++j) {
            for (let k = j; k < 19; ++k) {
                let x = nums[i];
                let y, z;
                if (k > 9) {
                    z = - nums[k-9];
                }else z = nums[k];
                if (j > 9){
                    y = - nums[j-9];
                }else y = nums[j];
                if (x+y+z < 50 && x+y+z > 0) {
                    sols[x+y+z] += 1;
                    if (k < 10 && j < 10) sols_sum[x+y+z]++;
                }
            }
        }
    }



    let max = 0;
    let max_sum = 0;
    let max_p = 0;

    for (let i = 0; i < 50; ++i) {
        if(sols_sum[i]>max_sum) {
            max_sum = sols_sum[i];
            max = sols[i];
            max_p = i;
        }
    }

    for (let i = 1; i < 10; ++i) {
      let id = "A" + i;
      let a = document.getElementById(id);
      a.textContent = nums[i];
      a.setAttribute("data-key", nums[i]);
    }
    let r = document.getElementById("goal");
    num = max_p;
    maxSol = max;
    guessedCount = 0;
    r.textContent = num;
    let score = document.getElementById("score");
    score.textContent = guessedCount+"/"+maxSol;
    set.clear();
    for(let i = 0; i < 5; i++) {
      handleDeleteNumber();

    } 
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");
    for (let index = 0; index < 5; index += 1) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  function handleDeleteNumber() {
    const currentNumberArr = getCurrentNumberArr();
    if (availableSpace>1) {
      const lastNumberEl = document.getElementById(String(availableSpace - 1));
      currentNumberArr.pop();
      guessedNumbers[guessedNumbers.length - 1] = currentNumberArr;
      lastNumberEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
  }

  for (let i = 0; i < keys_1.length; i++) {
    keys_1[i].onclick = ({ target }) => {

      const Number = target.getAttribute("data-key");
      
      if (Number === "enter") {
        handleSubmitNumber();
        return;
      }

      if (Number === "del") {
        handleDeleteNumber();
        return;
      }

      if (Number === "new-game") {
        reset();
        console.log(tim.textContent);
        get_new_game();
        return;
      }

      if (Number === "daily") {
        reset();
        console.log(tim.textContent);
        get_new_game(true);
        return;
      }

      updateGuessedNumbers(Number);
    };
  }

  let he = document.getElementById("hel");
  he.onclick = ({ target }) => window.alert("Combine the numbers with adds and substracts in order to achieve the goal. Any possibility is allowed: you can use one, two or three numbers.  Explore mental calculus and find all the permutations!");
  
});


/////////////////////////////////////////
// FUNCTIONS RELATED TO LOCAL STORAGE ///
/////////////////////////////////////////

// Save completed challenges to localStorage
function markChallengeCompleted(challengeId) {
  const completedDailyChallenges = JSON.parse(localStorage.getItem('completedDailyChallenges')) || [];
  
  if (!completedDailyChallenges.includes(challengeId)) {
      completedDailyChallenges.push(challengeId);
      localStorage.setItem('completedDailyChallenges', JSON.stringify(completedDailyChallenges));
  }
}

// Check if a challenge is completed
function getNumberOfCompletedDaily() {
  const completedDailyChallenges = JSON.parse(localStorage.getItem('completedDailyChallenges')) || [];
  return completedDailyChallenges.length;
}
