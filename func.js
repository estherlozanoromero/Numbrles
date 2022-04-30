document.addEventListener("DOMContentLoaded", () => {
  createSquares();
  let guessedWords = [[]];
  let availableSpace = 1;

  let num;
  let maxSol;
  let word;
  let guessedCount = 0;
  const set = new Set();
  get_new_game();

  const keys_1 = document.querySelectorAll(".number-row button");
  const keys_2 = document.querySelectorAll("op-row button");



  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < 5) {
      if (currentWordArr.length % 2 == 0 && letter != "+" && letter != "-") {
        currentWordArr.push(letter);
        const availableSpaceEl = document.getElementById(String(availableSpace));
        availableSpace = availableSpace + 1;
        availableSpaceEl.textContent = letter;
      }
      else if (currentWordArr.length % 2 == 1 && (letter == "+" || letter == "-")) {
        currentWordArr.push(letter);
        const availableSpaceEl = document.getElementById(String(availableSpace));
        availableSpace = availableSpace + 1;
        availableSpaceEl.textContent = letter;
      }
    }
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();

    result = parseInt(currentWordArr[0]);
    for (i = 1; i < currentWordArr.length; ++i) {
        if (currentWordArr[i] == "+") {
            result += parseInt(currentWordArr[i+1]);
            ++i;
        }
        else if (currentWordArr[i] == "-") {
          result -= parseInt(currentWordArr[i+1]);
          ++i;
        }
    }

    let vec = new Array(3).fill(0);
    if (result === num) {
      vec[0] = parseInt(currentWordArr[0]);
      let j = 1;
      for (let i = 1; i < currentWordArr.length; ++i) {
        if (currentWordArr[i] == "+") {
          vec[j] = parseInt(currentWordArr[i+1]);
          ++i;
        }
        else if (currentWordArr[i] == "-") {
          vec[j] = -parseInt(currentWordArr[i+1]);
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
        window.alert("Congratulations! "+guessedCount+"/"+maxSol);
        let sol = document.getElementById("solutions-found");
        sol.textContent += currentWordArr.join('');
        sol.textContent += "  ";
      }

    } else {
      window.alert("Not "+ num + "! " +result);
    }
    for (let i = 1; i < 6; ++i) {
      handleDeleteLetter();
    }
  }


  function get_new_game() {
    let nums= [0];
    console.log("Comienza programa");

    for (let i = 1; i < 10; ++i) {
        nums[i]=Math.floor(Math.random()*25) + 1;
        let j = 0;
        while (j < i) {
            if (nums[j]==nums[i])  {
                nums[i]=Math.floor(Math.random()*25) + 1;
                j = 0;
            } else ++j;
        }
    }
    console.log("Creo array");
    let sols = new Array(50).fill(0);
    let sols_sum = new Array(50).fill(0);
    console.log("Entro for");

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
      set.clear();
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");
    for (let index = 0; index < 5; index += 2) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);

      if (index != 4) {
        let square = document.createElement("div");
        square.classList.add("small-square");
        square.setAttribute("id", index + 2);
        gameBoard.appendChild(square);
      }
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    const removedLetter = currentWordArr.pop();

    guessedWords[guessedWords.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = "";
    availableSpace = availableSpace - 1;
  }

  for (let i = 0; i < keys_1.length; i++) {
    keys_1[i].onclick = ({ target }) => {

      const letter = target.getAttribute("data-key");
      
      if (letter === "enter") {
        handleSubmitWord();
        return;
      }

      if (letter === "del") {
        handleDeleteLetter();
        return;
      }

      if (letter === "new-game") {
        get_new_game();
        return;
      }

      updateGuessedWords(letter);
    };
  }
});