//VARIABLE SETUP
var state = ["E", "E", "E",
             "E", "E", "E",
             "E", "E", "E"];

var player = "X";
var computer = "O";
var isPlayerTurn = true;
var isPlayerTurnInit = true;

var menu = document.getElementById("menu");
var openbtn = document.getElementById("showMenu");
var renderbtn = document.getElementById("render");
var closeSpan = document.getElementsByClassName("close")[0];
var restartSpan = document.getElementsByClassName("close")[1];
var playerSwapBtn = document.getElementById("player-letter");
var endgame = document.getElementById('endgame');
var result = document.getElementById('result');
//</VARIABLE SETUP

//DESIGN LOGIC
openbtn.onclick = function() {
  openMenu();
};
renderbtn.onclick = function() {
  renderBoard();
};
playerSwapBtn.onclick = function() {
  swapPlayer();
};
closeSpan.onclick = function() {
  closeMenu();
  renderBoard();
  aiCheck();
};
restartSpan.onclick = function() {
  closeEndGame();
  reset();
}
/*window.onclick = function(event) {
  if (event.target == menu) {
    closeMenu();
  }
};*/
function openMenu() {
  menu.style.display = "block";
}
function openEndGame() {
  endgame.style.display = 'block';
}
function closeMenu() {
  menu.style.display = "none";
}
function closeEndGame() {
  endgame.style.display = 'none';
}

//</DESIGN LOGIC

//GAME LOGIC
function checkEndgame() {
  for (var i = 0; i < 9; i++) {
    if (i % 3 == 0) {
      if (state[i] == state[i + 1] == state[i + 2]) {
        return true;
      }
    }
    if (i < 3) {
      if (state[i] == state[i + 3] == state[i + 6]) {
        return true;
      }
    }
    if (state[0] == state[4] == state[8] || state[2] == state[4] == state[6]) {
      return true;
    }
  }
}

function gradeBoard() {
  // The system 'grades' the board according to the
  // 'danger' presented by the opposition (player).
  // We can use such a simplistic approach because TTT
  // is a rudimentary zero sum game. In other words,
  // minimizing the opposition's advantage is
  // functionally equal to maximizing your own.
  var gradedBoard = state.slice();
  for (var b = 0; b < 9; b++) {
    if (gradedBoard[b] == "E") {
      gradedBoard[b] = 0;
    }
  }
  var gb = gradedBoard;
  if (isFullArray(gb)) {
      result.innerHTML = ("It's a tie");
      openEndGame();
  }
  //console.log('gb at beginning: ' + gb);

  for (var i = 0; i < 3; i++) {
    //Grade rows
    var rowStart = i * 3;
    row = [gb[rowStart], gb[rowStart + 1], gb[rowStart + 2]];
    if (isUniformArray(row)) {
      if (gb[rowStart] == 'C') {
        result.innerHTML = ('AI wins!');
      } else {
        result.innerHTML = ('You win!');
      }
      openEndGame();
    }
    //console.log (i + '. row: ' + row);
    var rowCounter = 0;
    for (var r1 = 0; r1 < 3; r1++) {
      if (row[r1] == "C") {
        rowCounter -= 1;
      }
      if (row[r1] == "P") {
        rowCounter += 1;
      }
    }
    if (rowCounter == 2) {
      rowCounter = 4;
    }
    if (rowCounter == -2) {
      rowCounter = 0;
    }
    //console.log('rowCounter for i: ' + i + ' is ' + rowCounter);
    for (var r2 = 0; r2 < 3; r2++) {
      if (Number.isInteger(row[r2])) {
        row[r2] = row[r2] + rowCounter;
        gb[rowStart + r2] += rowCounter; 
        //console.log('current addition of rowCounter= ' + rowCounter+ ' made to cell: ' + (rowStart+r2) + ' which became ' + gb[rowStart + r2]);
      }
    }

    //Grade columns
    var colStart = i;
    col = [gb[colStart], gb[colStart + 3], gb[colStart + 6]];
    if (isUniformArray(col)) {
      if (gb[colStart] == 'C') {
        result.innerHTML = ('AI wins!');
      } else {
        result.innerHTML = ('You win!');
      }
      openEndGame();
    }
    var colCounter = 0;
    for (var c1 = 0; c1 < 3; c1++) {
      if (col[c1] == "C") {
        colCounter -= 1;
      }
      if (col[c1] == "P") {
        colCounter += 1;
      }
    }
    if (colCounter == 2) {
      colCounter = 4;
    }
    if (colCounter == -2) {
      colCounter = 0;
    }
    //console.log('colCounter: ' + colCounter);
    for (var c2 = 0; c2 < 3; c2++) {
      if (Number.isInteger(col[c2])) {
        col[c2] = col[c2] + colCounter;
        gb[colStart + c2 * 3] += colCounter;
        //console.log('current addition from colCounter= ' + colCounter+ ' made to cell: ' + (colStart + c2 * 3) + '=' + (gb[colStart+c2*3] - col[c2]) + ' which became ' + gb[colStart + c2 * 3]);
      }
    }

    //Grade diagonals
    if (i != 1) {
      coords = [i, 4, 8 - i];
      diag = [gb[i], gb[4], gb[8 - i]];
      if (isUniformArray(diag)) {
        if (gb[i] == 'C') {
          result.innerHTML = ('AI wins!');
        } else {
          result.innerHTML = ('You win!');
        }
      openEndGame();
    }
      var diaCounter = 0;
      for (var d1 = 0; d1 < 3; d1++) {
        if (diag[d1] == "C") {
          diaCounter -= 1;
        }
        if (diag[d1] == "P") {
          diaCounter += 1;
        }
      }
      if (diaCounter == 2) {
      //console.og('found two same at ' + i + '. diag: ' + diag);
        diaCounter = 4;
      }
      if (diaCounter == -2) {
      //console.log('found two same at ' + i + '. diag: ' + diag);
        diaCounter = 0;
      }
      //console.log('diaCounter: ' + diaCounter);
      for (var d2 = 0; d2 < 3; d2++) {
        if (Number.isInteger(diag[d2])) {
          diag[d2] = diag[d2] + diaCounter;
          gb[coords[d2]] += diaCounter;
        //console.log('current addition from diaCounter= ' + diaCounter+ ' made to cell: ' + (coords[d2]) + ' which became ' + gb[coords[d2]]);
        }
      }
    } //end of if
  } //enD of big for
    console.log(gb);
    return gb;
}

function aiCheck() {
  gradeBoard();
  if (!isPlayerTurn && !isFullBoard(state)) {
    moveAI();
  }
}

function moveAI() {
  //Grade board's danger points
  var gradedBoard = gradeBoard();

  //Move AI
  maxVal = 0;
  maxI = 0;
  for (var i = 0; i < 9; i++) {
    if (Number.isInteger(gradedBoard[i]) && gradedBoard[i] >= maxVal) {
      maxVal = gradedBoard[i];
      maxI = i;
    }
    // If no specific danger on board (say, first turn)
    // then randomize with weight toward the center
  }
    if (
      Number.isInteger(gradedBoard[i]) &&
      gradedBoard[i] == maxVal &&
      Math.floor(Math.random() * 10 + 1) < 6
    ) {
      maxVal = gradedBoard[i];
      maxI = i;
    }
  

  //if (maxVal == 0) {
  //  state[4] = "C";
  //} else {
    state[maxI] = "C";
    console.log('ai moves to: ' + maxI);
  //}
  renderBoard();
  isPlayerTurn = true;
}
//</GAME LOGIC

function renderBox(string, boxElem) {
  boxElem.innerHTML = string;
}

function renderBoard() {
  for (var i = 0; i < 9; i++) {
    var cur = state[i];
    var box = document.getElementsByClassName("box")[i];
    if (cur == "E") {
      //set white
    }
    box.innerHTML = translateSign(cur);
  }
}

function translateSign(str) {
  if (str == "P") {
    return player;
  } else if (str == "C") {
    return computer;
  } else {
    return "E";
  }
}

function swapPlayer() {
  if (player == "X") {
    playerSwapBtn.innerHTML = "Play as: O";
    isPlayerTurn = false;
    isPlayerTurnInit = false;
    player = "O";
    computer = "X";
  } else {
    playerSwapBtn.innerHTML = "Play as: X";
    isPlayerTurn = true;
    isPlayerTurnInit = true;
    player = "X";
    computer = "O";
  }
}

function movePlayer (index) {
  if (state[index] == 'E' && isPlayerTurn) {
    state[index] = 'P';
    renderBoard();
    isPlayerTurn = false;
    aiCheck();
  } 
}

window.onload = openMenu();

function reset () {
  state = ['E','E','E','E','E','E','E','E','E'];
  isPlayerTurn = isPlayerTurnInit;
  renderBoard();
  openMenu();
}

function isUniformArray (arr) {
  var one = arr[0];
  for (var i = 1; i < arr.length; i ++) {
    if (arr[0] != arr[i] || Number.isInteger(arr[i])) {
      return false;
    }
  }
  return true;
}

function isFullArray (arr) {
  for (var i = 1; i < arr.length; i ++) {
    if (Number.isInteger(arr[i])) {
      return false;
    }
  }
  return true;
}

function isFullBoard (arr) {
  for (var i = 1; i < arr.length; i ++) {
    if (arr[i] == 'E') {
      return false;
    }
  }
  return true;
}