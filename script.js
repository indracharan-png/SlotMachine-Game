/*
1. Deposit the money
2. Determine no. of lines to bet on and collecting bet money for each line individually
4. Spin the slot machine
5. Check if the user won the rows he placed bet on
6. Give the user their winnings
7. Play again
*/

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;
const slotMachineSize = 3;

/* Object to store bet info for each line */
const betInfo = {};
for (let i = 1; i <= slotMachineSize; i++) {
  betInfo[i] = 0;
}

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

/* Depositing the money */
const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit number: ");
    const numberDepositAmount = parseFloat(depositAmount);
    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid amount, try again.");
    } else {
      return numberDepositAmount;
    }
  }
};

/* Determining the number of lines to play on and getting the bet amount for each line separately */
const settingBets = (currentAmt) => {
  let balanceAfterBets = currentAmt;
  showCurrentBetStats(betInfo);
  let cnt = 0;
  while (cnt < slotMachineSize) {
    console.log(`Your current amount: $${balanceAfterBets}`);
    // getting the line no. to bet on
    let lineNo;
    while (true) {
      lineNo = parseFloat(prompt("Enter a row number you want to bet on: "));
      if (
        lineNo <= 0 ||
        lineNo > slotMachineSize ||
        isNaN(lineNo) ||
        lineNo % 1 !== 0 ||
        betInfo[lineNo] !== 0
      ) {
        console.log("Invalid entry, try again.");
      } else {
        break;
      }
    }
    // getting the bet amount for the line selected
    let betAmtForLine;
    while (true) {
      betAmtForLine = parseFloat(
        prompt(`Now enter the bet amount for row-${lineNo}: $`)
      );
      if (
        isNaN(betAmtForLine) ||
        betAmtForLine <= 0 ||
        betAmtForLine > balanceAfterBets
      ) {
        console.log("Invalid amount, try again.");
      } else {
        balanceAfterBets -= betAmtForLine;
        break;
      }
    }
    betInfo[lineNo] = betAmtForLine;
    cnt++;
    showCurrentBetStats(betInfo);
    // if all lines are selected move to next step
    if (cnt === slotMachineSize) break;
    // asking the player whether to continue or stop
    const decision = prompt(
      "Press 'c' to continue betting on new lines.Press any button to spin the wheel."
    );
    if (decision !== "c") break;
  }
  return balanceAfterBets;
};

/* Showing current betting stats to the player */
const showCurrentBetStats = (betInfoObj) => {
  for (const [betLine, betLineAmt] of Object.entries(betInfoObj)) {
    console.log(`Line - ${betLine}, Bet- ${betLineAmt}`);
  }
};

/* Spinning the wheel */
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 1; i <= count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i][j] = selectedSymbol;
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

/* Transposing the matrix */
const transposeArray = (rows) => {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      // swapping the values using upper triangle
      if (i < j) {
        const temp = rows[i][j];
        rows[i][j] = rows[j][i];
        rows[j][i] = temp;
      }
    }
  }
  return rows;
};

/* Printing the slot machine output */
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
  return;
};

/* Calculating the winnings */
const getWinnings = (rows) => {
  let winningsAmount = 0;
  // going through all the lines then checking if there is a bet on those lines
  for (let rowIdx = 0; rowIdx < slotMachineSize; rowIdx++) {
    const currentRow = rows[rowIdx];
    let isAllSame = true;
    for (const symbol of currentRow) {
      if (symbol !== currentRow[0]) {
        isAllSame = false;
        break;
      }
    }
    if (isAllSame) console.log("hiii");
    if (isAllSame && betInfo[rowIdx + 1] > 0) {
      winningsAmount += betInfo[rowIdx + 1] * SYMBOL_VALUES[currentRow[0]];
    }
  }
  return winningsAmount;
};

/* Playing game */
const playGame = () => {
  let currAmount = deposit();
  while (true) {
    console.log("Your current balance: $" + currAmount);
    const remainingAmount = settingBets(currAmount);
    const reels = spin();
    const transposedRows = transposeArray(reels);
    printRows(transposedRows);
    const winnings = getWinnings(transposedRows);
    currAmount = remainingAmount + winnings;
    console.log("You won: $" + winnings);
    // break out if user runs out of money
    if (currAmount <= 0) {
      break;
    }
    const playAgain = prompt("Do you want to play again (y/n)?");
    if (playAgain !== "y") break;
  }
};

playGame();
