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
let scientificNotation = false;
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
  scientificNotation = false;
  displayError = false;
  resetClicked = true;
};

// Display numbers 
function displayNumbers() {
  numButtons.forEach((button) => {
    const number = button.textContent;
    button.addEventListener("click", () => {

      if (displayError) {
        resetCalculator();
        result.textContent = "";
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

// Format numbers with decimal places, and convert to scientific notation if the number is too large or too small
function formatNumbers() {
  let scientificResult = result.textContent.replace(/\s/g, "");
 
  if (previousOperator !== null && operator !== null) {
    // Case for integers without decimals and scientific notations
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
    // Case for scientific notations
    } else if (scientificResult.includes("e")) {
      let sciExponent = parseInt(scientificResult.split("e")[1]);
      if (sciExponent > 20 || sciExponent < 0) {                                                                  // If exponent of scientific notation is greater than 20 or lower than 0
        scientificResult = Number.parseFloat(scientificResult).toExponential(5).replace(/(\.?0+)?e/, "e");        // then keep rounding to 5 decimal places
      };
    // Case for decimal numbers (excluding scientific notations)
    } else if (scientificResult.includes(".") && !scientificResult.includes("e")) {
      const decimalNum = parseFloat(scientificResult);
      const absoluteNum = Math.abs(decimalNum);
      if (absoluteNum >= 1e+9) {
        scientificResult = decimalNum.toExponential(5).replace(/(\.?0+)?e/, "e");
      } else if (absoluteNum >= 1) {                                                                              // If greater or equal to 1, round to 1 decimal
        scientificResult = decimalNum.toFixed(1).replace(/\.?0+$/, "");
      } else if (absoluteNum >= 0.00001 && absoluteNum < 1) {                                                     // If between 0.00001 and 0.99999, round to 5 decimals
        scientificResult = decimalNum.toFixed(5).replace(/\.?0+$/, "");                       
      } else {                                                                                                    // if less than 0.00001, convert to scientific notation
        scientificResult = decimalNum.toExponential(5).replace(/(\.?0+)?e/, "e");
      };
    };
  };

  scientificNotation = true;
  result.textContent = scientificResult;
  expression.textContent = ` ${scientificResult} ${operator}`;
  formatNumberWithSpaces();

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

  // Display "ERROR" when dividing by zero
  if ((previousOperator === "/" && operator !== null) && secondNum === 0) {
    result.textContent = "ERROR";
    expression.textContent = "";
    firstNum = null;
    secondNum = null;
    previousResult = null;
    displayError = true;
  };
};

// Handle error after dividing by 0
function errorHandler() {
  reset();
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





function addNumbers() {
  add.addEventListener("click", () => {

    if (resetClicked) {                                                                       // If 'AC' clicked, stay in reset mode, unless a new number is entered
      reset();
      result.textContent = "0";
      return;
    };

    if (displayError) {
      errorHandler();
      return;
    };

    if (addClicked && previousOperator !== "+") {                                             // If 'add' clicked, then 'other operator' was clicked, and then 'add' again, then perform addition 
      previousOperator = "+";
    };

    operator = "+";

    if (scientificNotation) {                                                           
      expression.textContent = `${formatNumbers()} ${operator}`;
    } else {
      scientificNotation = false;
      expression.textContent = `${firstNum} ${operator}`;
      if (!numberClicked && previousOperator === null) {                                      // Case if no number was clicked before operator at the start
        expression.textContent = ""; 
        result.textContent = "0";
        return;
      };
    };

    if (operatorClicked && addClicked) {                                                      // If operator was clicked ("+"), and clicked again ("+") right after
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      if (firstNum !== null || secondNum !== null) {                                          // If first and second numbers are not empty
        return;                                                                               // Return nothing, unless same operator is clicked and number entered, return that operation result
      };
    } else if (subtractClicked || multiplyClicked || divideClicked) {                         // If 'subtract' was clicked or 'multiply' or 'divide', then 'add' was clicked, then return addition
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      previousOperator = "+";
      if (firstNum !== null || secondNum !== null) {
        if (!previousResult) {
          expression.textContent = `${firstNum} ${operator}`;
        };
        return;
      };
    };

    operatorClicked = true;
    multiplyClicked = false;
    divideClicked = false;
    subtractClicked = false;
    addClicked = true;
    
    calculateNumbers();
    expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
    previousOperator = "+";                                                                   // previousOperator behaves as current operator
  });
};

function subtractNumbers() {
  subtract.addEventListener("click", () => {

    if (resetClicked) {                                                                     
      reset();
      result.textContent = "0";
      return;
    };
    
    if (displayError) {
      errorHandler();
      return;
    };

    if (subtractClicked && previousOperator !== "-") {                                       
      previousOperator = "-";
    };

    operator = "-";
   
    if (scientificNotation) {                                                           
      expression.textContent = `${formatNumbers()} ${operator}`;
    } else {
      scientificNotation = false;
      expression.textContent = `${firstNum} ${operator}`;
      if (!numberClicked && previousOperator === null) {
        expression.textContent = "";
        result.textContent = "0";
        return;
      };
    };
   
    if (operatorClicked && subtractClicked) {
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked || multiplyClicked || divideClicked) {
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      previousOperator = "-";
      if (firstNum !== null || secondNum !== null) {
        if (!previousResult) {
          expression.textContent = `${firstNum} ${operator}`;
        };
        return;
      };
    };
 
    operatorClicked = true;
    multiplyClicked = false;
    divideClicked = false;
    addClicked = false;
    subtractClicked = true;
    
    calculateNumbers();
    expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
    previousOperator = "-";
  });
};

function multiplyNumbers() {
  multiply.addEventListener("click", () => {

    if (resetClicked) {                                                                     
      reset();
      result.textContent = "0";
      return;
    };

    if (displayError) {
      errorHandler();
      return;
    };

    if (multiplyClicked && previousOperator !== "x") {                                      
      previousOperator = "x";
    };

    operator = "x";

    if (scientificNotation) {                                                           
      expression.textContent = `${formatNumbers()} ${operator}`;
    } else {
      scientificNotation = false;
      expression.textContent = `${firstNum} ${operator}`;
      if (!numberClicked && previousOperator === null) {
        expression.textContent = "";
        result.textContent = "0";
        return;
      };
    };
    
    if (operatorClicked && multiplyClicked) {
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked || subtractClicked || divideClicked) {
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      previousOperator = "x";
      if (firstNum !== null || secondNum !== null) {
        if (!previousResult) {
          expression.textContent = `${firstNum} ${operator}`;
        };
        return;
      };
    };

    operatorClicked = true;
    addClicked = false;
    divideClicked = false;
    subtractClicked = false;
    multiplyClicked = true;

    calculateNumbers();
    expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
    previousOperator = "x";
  });
};

function divideNumbers() {
  divide.addEventListener("click", () => {

    if (resetClicked) {                                                                     
      reset();
      result.textContent = "0";
      return;
    };

    if (displayError) {
      errorHandler();
      return;
    };

    if (divideClicked && previousOperator !== "/") {                                      
      previousOperator = "/";
    };

    operator = "/";

     if (scientificNotation) {                                                           
      expression.textContent = `${formatNumbers()} ${operator}`;
    } else {
      scientificNotation = false;
      expression.textContent = `${firstNum} ${operator}`;
      if (!numberClicked && previousOperator === null) {
        expression.textContent = "";
        result.textContent = "0";
        return;
      };
    };

    if (operatorClicked && divideClicked) {
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked || subtractClicked || multiplyClicked) {
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      previousOperator = "/";
      if (firstNum !== null || secondNum !== null) {
        if (!previousResult) {
          expression.textContent = `${firstNum} ${operator}`;
        };
        return;
      };
    };
  
    operatorClicked = true;
    addClicked = false;
    subtractClicked = false;
    multiplyClicked = false;
    divideClicked = true;

    calculateNumbers();
    expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
    previousOperator = "/";
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
