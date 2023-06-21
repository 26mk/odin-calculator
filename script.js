function notifyRound() {
  document.getElementById("display-round").innerHTML = "Rounded";
}

// Operation: num1 operator num2 (variables for each)
let num1 = "0";
let num2 = "";
let operation = "";
let opSymbol = "";
let result = "0";
let rounded = false;
let opGiven = false;

function display() {
  rounded
    ? notifyRound()
    : (document.getElementById("display-round").innerHTML = "");
  if (num2 != "") {
    document.getElementById("display-eq").innerHTML =
      num1.toString() +
      "     " +
      opSymbol.toString() +
      "     " +
      num2.toString() +
      "     =";
    // Reset all
    num1 = result.toString();
    operation = "";
    opSymbol = "";
    num2 = "";
    opGiven = false;
  } else {
    document.getElementById("display-eq").innerHTML = "";
  }
  document.getElementById("display-key").innerHTML = result.toString();
}

display();

function displayNum(n) {
  rounded = false;
  if (
    (0 < Math.abs(n) && Math.abs(n) < 0.000000001) ||
    Math.abs(n) > 9999999999
  ) {
    // Use exponential form for very big/small numbers
    rounded = true;
    result = n.toExponential(9).toString();
    display();
    return;
  } else if (!Number.isInteger(n) && n.toString().length > 11) {
    // Limit total digits to 10 (excluding decimal) for decimal numbers
    rounded = true;
    // Split number to integer and decimal parts
    let nSplit = n.toString().split(".", 2);
    result = n.toFixed(10 - nSplit[0].length).toString();
    display();
    return;
  }
  rounded = false;
  result = n.toString();
  display();
  return; // n is an integer or float with 10 digits or less
}

function getSum(x, y) {
  displayNum(parseFloat(x) + parseFloat(y));
  return;
}

function getDifference(x, y) {
  displayNum(parseFloat(x) - parseFloat(y));
  return;
}

function getProduct(x, y) {
  displayNum(parseFloat(x) * parseFloat(y));
  return;
}

function getQuotient(x, y) {
  if (/^[0.]+$/.test(y)) {
    // Show divide by 0 error
    result = "Divide by 0 error";
    display();
    num1 = "0";
    num2 = "0";

    return;
  }
  displayNum(parseFloat(x) / parseFloat(y));
  return;
}

// Clear button: clear all variables, reset display
function resetVar() {
  num1 = "0";
  num2 = "";
  operation = "";
  opSymbol = "";
  result = "0";
  rounded = false;
  opGiven = false;
}

function clearAll() {
  resetVar();
  display();
}

document.getElementById("clear-btn").addEventListener("click", clearAll);

// On click, update display with numbers/operations
let numButtons = document.getElementsByClassName("num-btn");
for (let i = 0; i < numButtons.length; i++) {
  numButtons[i].addEventListener("click", () => {
    if (opGiven) {
      if (num2 == "0") num2 = "";
      num2 += numButtons[i].innerHTML;
      updateDisplay();
    } else {
      if (num1 == "0") num1 = "";
      num1 += numButtons[i].innerHTML;
      updateDisplay();
    }
  });
}

// Avoid leading zeroes
function addZero() {
  if (num1 != "0" && !opGiven) {
    num1 += "0";
    updateDisplay();
  } else if (opGiven && num2 != "0") {
    num2 += "0";
    updateDisplay();
  }
}

document.getElementById("0-btn").addEventListener("click", addZero);

// Decimal button (only one per number; if num2 not entered yet, auto add 0)
function addDecimal() {
  if (!opGiven && !num1.includes(".")) {
    num1 += ".";
    updateDisplay();
  } else if (opGiven && !num2.includes(".")) {
    if (num2 == "") num2 = "0";
    num2 += ".";
    updateDisplay();
  }
}

document.getElementById("dec-btn").addEventListener("click", addDecimal);

// Delete button: erase last digit of num1/num2 (if nothing, reset with 0)
function deleteDigit() {
  if (!opGiven) {
    num1.length > 1
      ? (num1 = num1.substring(0, num1.length - 1))
      : (num1 = "0");
    updateDisplay();
  } else {
    num2 != "" && num2.length > 1
      ? (num2 = num2.substring(0, num2.length - 1))
      : (num2 = "0");
    updateDisplay();
  }
}

document.getElementById("delete-btn").addEventListener("click", deleteDigit);

// Operation buttons: set operation (quot, prod, diff, sum)
let opButtons = document.getElementsByClassName("op-btn");
for (let i = 0; i < opButtons.length; i++) {
  opButtons[i].addEventListener("click", () => {
    if (num2 == "") {
      operation = opButtons[i].id.split("-", 1);
      opSymbol = opButtons[i].innerHTML;
      opGiven = true;
      updateDisplay();
    }
  });
}

// Equal button (operation is quot, prod, diff or sum) (display)
function operate() {
  if (opGiven && num2 != "") {
    if (operation == "quot") {
      getQuotient(num1, num2);
      return;
    }
    if (operation == "prod") {
      getProduct(num1, num2);
      return;
    }
    if (operation == "diff") {
      getDifference(num1, num2);
      return;
    }
    if (operation == "sum") {
      getSum(num1, num2);
      return;
    }
  }
}

document.getElementById("eq-btn").addEventListener("click", operate);

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key == 0) addZero();
  if (e.key > 0 && e.key <= 9) {
    if (opGiven) {
      num2 == "0" ? (num2 = e.key) : (num2 += e.key);
    } else {
      num1 == "0" ? (num1 = e.key) : (num1 += e.key);
    }
    updateDisplay();
  }
  if (e.key === "+") {
    operation = "sum";
    opSymbol = "+";
    opGiven = true;
    updateDisplay();
  }
  if (e.key === "*") {
    operation = "prod";
    opSymbol = "×";
    opGiven = true;
    updateDisplay();
  }
  if (e.key === "-") {
    operation = "diff";
    opSymbol = "−";
    opGiven = true;
    updateDisplay();
  }
  if (e.key === "/") {
    operation = "quot";
    opSymbol = "÷";
    opGiven = true;
    updateDisplay();
  }
  if (e.key === ".") addDecimal();
  if (e.key == "Enter" || e.key == "=") operate();
  if (e.key == "Backspace") deleteDigit();
});

function updateDisplay() {
  // Updating first number
  if (!opGiven) {
    document.getElementById("display-eq").innerHTML = "";
    document.getElementById("display-key").innerHTML = num1;
  }
  // Updating operation (second number not given)
  else if (num2 == "") {
    document.getElementById("display-key").innerHTML = "";
    document.getElementById("display-eq").innerHTML = num1 + "     " + opSymbol;
  } // Updating second number
  else {
    document.getElementById("display-eq").innerHTML = num1 + "     " + opSymbol;
    document.getElementById("display-key").innerHTML = num2;
  }
}
