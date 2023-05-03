// Calculator by Vlad Hadyak

// Output variables
const result = document.querySelector(".result");
const expression = document.querySelector(".expression");

// Operator variables
const add = document.querySelector("#addition");
const subtract = document.querySelector("#subtraction");
const divide = document.querySelector("#division");
const multiply = document.querySelector("#multiplication");
const equal = document.querySelector("#equals");

// Calculator extra feature variables
const clearAll = document.querySelector("#ac");

// Values
let numericValue = 0;
let operator = "";
let firstNum = null;
let secondNum = null;
let previousOperator = null;
let previousResult = null;

// Boolean buttons
let addClicked = false;
let subtractClicked = false;
let multiplyClicked = false;
let divideClicked = false;
let equalClicked = false;
let numberClicked = false;
let operatorClicked = false;
let resetClicked = false;

// Boolean function status
let numberFormat = false;
let displayError = false;

// Include 10 number buttons
const numButtons = [];

for (let i = 0; i <= 9; i++) {
  numButtons[i] = document.querySelector("#num" + i);
}; 

// Reset
function reset() {
  result.textContent = "";
  expression.textContent = "";
  firstNum = null;
  secondNum = null;
  operator = null;
  previousResult = null;
  previousOperator = null;
  operatorClicked = false;
  addClicked = false;
  subtractClicked = false;
  multiplyClicked = false;
  divideClicked = false;
  numberFormat = false;
  displayError = false;
  resetClicked = true;
};

// Display numbers 
function displayNumbers() {
  numButtons.forEach((button) => {
    const number = button.textContent;
    button.addEventListener("click", () => {

      if (displayError) {                                                                     // Start fresh if new number was clicked after an error
        resetCalculator();
        result.textContent = "";
        expression.textContent = "";
        displayError = false;                                                                 
      };

      if (result.textContent === "0" && numberClicked) {
        result.textContent = "";
      } else if (result.textContent === "0" && !numberClicked) {
        result.textContent = "";
      };

      numberClicked = true;
       
      // Clear 'result' display every-time a new number is clicked after operator 
      if (addClicked) {                                     
        result.textContent = "";
        addClicked = false;
      } else if (subtractClicked) {
        result.textContent = "";
        subtractClicked = false;
      } else if (multiplyClicked) {
        result.textContent = "";
        multiplyClicked = false;
      } else if (divideClicked) {
        result.textContent = "";
        divideClicked = false;
      } else if (resetClicked) {                                                              // After 'AC' is clicked and consecutive operator clicks, it will always be in 'reset' mode ...
        resetClicked = false;                                                                 // Unless there is new random number clicked, then it will disable the reset mode
      };
      
      result.textContent += number;

      numericValue = parseFloat(displayMaxNumberLength()); 
      result.textContent = displayMaxNumberLength(); 
      
      result.textContent = formatNumberWithSpaces();
      numericValue = parseFloat(result.textContent.replace(/\s/g, ""));                       // Remove whitespace before parsing, and retain the whole value
    });
  });
};
displayNumbers();

// Display a number of max to 9 digits (not including decimal numbers)
function displayMaxNumberLength() {
  let numDisplay = result.textContent.replace(/\s+/g, "");
  let numParts = numDisplay.split(".");                                                       // Separate a number into numbers 'before' and 'after' a decimal (if there are any)
 
  if (numParts[0].length > 9) {                                                               // If integer number is greater than 9, display only 9 digits
    numParts[0] = numParts[0].substring(0, 9); 
  };

  if (numParts.length > 1) {                                                                  // Check if there decimal numbers
    numDisplay = numParts[0] + "." + numParts[1];                                             // Include any digits before the decimal, and after
  } else {
    numDisplay = numParts[0];
  };

  return numDisplay;
};

// Space out numbers for every 3 digits for better readability
function formatNumberWithSpaces() {
  let spacedOutput = result.textContent;
  spacedOutput = spacedOutput.replace(/(\d)(?=(\d{3})+(?!\d|e[\+\-]))/g, "$1 ");              // Separates every 3 digits, excluding scientific notation

  if (spacedOutput.startsWith("0.") || spacedOutput.startsWith("-0.")) {                      // Remove any whitespace from numbers starting with 0. or -0.
    spacedOutput = spacedOutput.replace(/\s/g, "");
  };

  result.textContent = spacedOutput;
  return spacedOutput;
};

// Format integers, excluding decimal numbers and scientific notation
function formatIntegers(scientificResult) {
  if (!scientificResult.includes(".") && !scientificResult.includes("e")) {
    let intNum = parseInt(scientificResult);
    if (intNum >= 0) {
      if (Math.abs(intNum) >= 1e+9) {                                                                           // 1e+9 short for 1,000,000,000
        scientificResult = Number.parseFloat(intNum).toExponential(5).replace(/(\.?0+)?e/, "e");                // Removes any trailing 0s for scientific notation
      } else {
        scientificResult = intNum.toFixed(1).replace(/\.?0+$/, '');                                             // Removes any trailing 0s and rounds it to 1 decimal place
      };
    } else {                                                                                                    // Case for negative integers
      if (Math.abs(intNum) >= 1e+9) {
        scientificResult = Number.parseFloat(intNum).toExponential(5).replace(/(\.?0+)?e/, "e");
      } else {
        scientificResult = intNum.toFixed(1).replace(/\.?0+$/, '');
      };
    };
  };
  return scientificResult;
};

// Format scientific notation only
function formatScientificNotation(scientificResult) {
  if (scientificResult.includes("e")) {
    let sciExponent = parseInt(scientificResult.split("e")[1]);
    if (sciExponent > 20 || sciExponent < 0) {                                                                  // If exponent of scientific notation is greater than 20 or lower than 0
      scientificResult = Number.parseFloat(scientificResult).toExponential(5).replace(/(\.?0+)?e/, "e");        // then keep rounding to 5 decimal places
    };
  };
  return scientificResult;
};

// Format decimal numbers, excluding scientific notation
function formatDecimals(scientificResult) {
  if (scientificResult.includes(".") && !scientificResult.includes("e")) {
    const decimalNum = parseFloat(scientificResult);
    const absoluteNum = Math.abs(decimalNum);                                                                   // Make decimal numbers as absolute numbers     

    if (absoluteNum >= 1e+9) {
      scientificResult = decimalNum.toExponential(5).replace(/(\.?0+)?e/, "e");
    } else if (absoluteNum >= 1) {                                                                              // If greater or equal to 1, round to 1 decimal
      scientificResult = decimalNum.toFixed(1).replace(/\.?0+$/, "");
    } else if (absoluteNum >= 0.00001 && absoluteNum < 1) {                                                     // If between 0.00001 and 0.99999 (+/-), round to 5 decimals
      scientificResult = decimalNum.toFixed(5).replace(/\.?0+$/, "");                       
    } else {                                                                                                    // if less than 0.00001, convert to scientific notation
      scientificResult = decimalNum.toExponential(5).replace(/(\.?0+)?e/, "e");
    };
  };
  return scientificResult;
};

// Format numbers
function formatNumbers() {
  let scientificResult = result.textContent.replace(/\s/g, "");                               // Make sure there isn't any unpredictable white space before formatting
 
  if (previousOperator !== null && operator !== null) {
    scientificResult = formatIntegers(scientificResult);
    scientificResult = formatScientificNotation(scientificResult);
    scientificResult = formatDecimals(scientificResult);
  };

  numberFormat = true;
  result.textContent = scientificResult;
  expression.textContent = ` ${scientificResult} ${operator}`;
  formatNumberWithSpaces();                                                                   // Space out the formatted numbers where necessary

  return scientificResult;
};

// Perform arithmetic operations
function operate(operator, firstNum, secondNum) {
  switch (operator) {
    case "+":
      return firstNum + secondNum;
    case "-":
      return firstNum - secondNum;
    case "x":
      return firstNum * secondNum;
    case "/":
      if (secondNum === 0) {                                                                  // Division by 0
        return null;
      } else {
        return firstNum / secondNum;
      };
    default:
      return null;
  };
};

// Calculate numbers to display a correct result
function calculateNumbers() {
  if (firstNum === null) {                                                                    // If previous calculations haven't been performed, then assign numericValue to firstNum
    firstNum = numericValue;
    expression.textContent = `${firstNum} ${operator} `;
    result.textContent = firstNum;
  } else {                                                                                    // If firstNum has a value
    secondNum = numericValue;                                                                 // Assign numericValue to secondNum after operator was clicked
    if (previousResult === null) {                                                            // If previousResult does not exist
      previousResult = firstNum;                                                              // Assign the value of firstNum as previousResult
    } else {                                                                                  // If previousResult has a value
      firstNum = operate(operator, firstNum, secondNum);                                      // Perform calculation of the previous firstNum and new secondNum value
      result.textContent = firstNum;
    };
    firstNum = operate(previousOperator || operator, previousResult, secondNum);              // Perform calculation using previousOperator and previousResult, and new secondNum
    previousResult = firstNum;                                                                // Update previousResult after operation
    expression.textContent = `${previousResult} ${operator} `;
    result.textContent = previousResult;
    formatNumbers();
    previousResult = parseFloat(result.textContent.replace(/\s/g, ""));                       // Make sure it handles decimal numbers correctly, to avoid inaccurate calculations
  };
  formatNumberWithSpaces();

  // Detect if there was division by 0
  if ((previousOperator === "/" && operator !== null) && secondNum === 0) {
    displayError = true;
  };
};

// Handle error after dividing by 0
function errorHandler() {
  reset();                                                                                    // Full reset
  expression.textContent = "";
  result.textContent = "0";
  displayError = true;
};

// Reset everything after reset button is clicked
function resetCalculator() {
  clearAll.addEventListener("click", () => {
    reset();
    result.textContent = "0";
  });
};
resetCalculator();

// Return an object of operators 
const getOperatorFlags = function() {
  return {
    "+": {
      clicked: addClicked,                                                                    // Checks currently clicked flag
      check: subtractClicked || multiplyClicked || divideClicked,                             // Checks previously clicked flags
    },
    "-": {
      clicked: subtractClicked,
      check: addClicked || multiplyClicked || divideClicked,
    },
    "x": {
      clicked: multiplyClicked,
      check: addClicked || subtractClicked || divideClicked,
    },
    "/": {
      clicked: divideClicked,
      check: addClicked || subtractClicked || multiplyClicked,
    },
  };
};

// Update expression display in appropriate format if there any decimal numbers or scientific notation
function updateExpressionFormat(operator) {
  if (numberFormat) {                                                                         
    expression.textContent = `${formatNumbers()} ${operator}`;
  } else {
    numberFormat = false;
    expression.textContent = `${firstNum} ${operator}`;
    if (!numberClicked && previousOperator === null) {                                        // If no number was clicked and previous operator not yet defined, then return nothing
      expression.textContent = "";
      result.textContent = "0";
      console.log("test");
      return;
    };
  };
};

// Detect if reset button was clicked
function resetIsClicked() {
  if (resetClicked) {                                                                         // If 'AC' clicked and no new number was entered, keep it in 'default' state                                
    reset();
    result.textContent = "0";  
    return true;
  };
  return false;
};

// Display an error if number divided by 0
function displayDivisionError() {
  if (displayError) {                                                                         // If 'ERROR' was displayed and operator "/" clicked, reset the calculator 
    errorHandler();
    result.textContent = "ERROR";
    expression.textContent = "";
    return true;
  };
  return false;
};

// Handler for when operators are clicked in the calculator 
function handleOperators(mathOperator) {

  operator = mathOperator;

  const operatorFlags = getOperatorFlags();

  // If 'AC' clicked, reset calculator
  if (resetIsClicked()) {                                                                     
    return;
  };

  updateExpressionFormat(operator);

  // Handle operator clicks
  if (operatorFlags[operator].clicked && previousOperator !== operator) {                     // Set previous operator to the operator that has been clicked (if they not the same operators)
   previousOperator = operator;
  };

  if (operatorFlags[operator].clicked && operatorClicked) {                                   // If same operator was clicked twice or more times
    expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
    if (firstNum !== null || secondNum !== null) {
      return;
    };
  } else if (operatorFlags[operator].check) {                                                 // If operator was clicked before, and is not the same as the currently clicked operator
    expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
    previousOperator = operator;
    if (firstNum !== null || secondNum !== null) {
      if (!previousResult) {
        expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      };
      return;
    };
  };

  operatorClicked = true;

  // Boolean clicked value is based on operator selected, and sets other remaining booleans to false
  addClicked = operator === "+";                                                   
  subtractClicked = operator === "-";
  multiplyClicked = operator === "x";
  divideClicked = operator === "/";
  
  calculateNumbers();

  // Display "ERROR" when divided by '0'
  if (displayDivisionError()) {                                                               
    return;
  };

  expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
  previousOperator = operator;                                                       
};

// Handle addition
function addNumbers() {
  add.addEventListener("click", () => {
    handleOperators("+");                                                              
  });
};

// Handle subtraction
function subtractNumbers() {
  subtract.addEventListener("click", () => {
    handleOperators("-");
  });
};

// Handle multiplication
function multiplyNumbers() {
  multiply.addEventListener("click", () => {
    handleOperators("x");
  });
};

// Handle division
function divideNumbers() {
  divide.addEventListener("click", () => {
    handleOperators("/");
  });
};

addNumbers();
subtractNumbers();
multiplyNumbers();
divideNumbers();




//const calculate = function() {
  //equal.addEventListener("click", () => {
    //if (operator === null) return;

    //secondNum = numericValue;
    //firstNum = operate(previousOperator, firstNum, secondNum);
    //expression.textContent = `${firstNum} `;
    //result.textContent = firstNum;

    //operator = null;
    //previousOperator = null;
    //operatorClicked = false;
    //firstNum = null;
    //secondNum = null;
  //});
//};
//calculate();


// 10.4 / 10 = 1 instead of 1.04 ** NOTE **