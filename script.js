// Calculator by Vlad Hadyak

// Output variables
const result = document.querySelector(".result");                                             // Lower display
const expression = document.querySelector(".expression");                                     // Upper display

// Operator variables
const add = document.querySelector("#addition");
const subtract = document.querySelector("#subtraction");
const divide = document.querySelector("#division");
const multiply = document.querySelector("#multiplication");
const equal = document.querySelector("#equals");

// Calculator extra feature variables
const clearAll = document.querySelector("#ac");
const percentage = document.querySelector("#percentage");
const backspace = document.querySelector("#delete");
const decimal = document.querySelector("#decimal");

// Values
let numericValue = 0;
let operator = "";
let firstNum = null;                                                                          // First num entered
let secondNum = null;                                                                         // Second num entered
let previousOperator = null;
let previousResult = null;                                                                    // Result of first and second numbers

// Status buttons
let addClicked = false;
let subtractClicked = false;
let multiplyClicked = false;
let divideClicked = false;
let equalClicked = false;
let numberClicked = false;
let operatorClicked = false;
let resetClicked = false;
let percentageClicked = false;
let backspaceClicked = false;

// Boolean function status
let numberFormat = false;
let displayError = false;

// Include number buttons from 0 to 9
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
  percentageClicked = false;
  backspaceClicked = false;
  equalClicked = false;
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

      if (result.textContent === "0" && (numberClicked || !numberClicked)) {
        result.textContent = "";
      };

      if (percentageClicked) {
        reset();
        resetClicked = false;
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
      } else if (resetClicked) {                                                              // After 'AC' is clicked and consecutive operator clicks, it will always be in 'reset'
        resetClicked = false;                                                                 // Unless there is new random number clicked, then it will disable the reset mode
      } else if (percentageClicked || (percentageClicked && previousResult !== null)) {       // If '%' clicked and new number is clicked, reset the display, or previousResult is known and '%' is clicked, 
        firstNum = null;                                                                      // ... reset only if new number is clicked after '%' and continue calculation if operator was clicked after '%'
        secondNum = null;
        previousResult = null;
        result.textContent = "";
        expression.textContent = "";
        percentageClicked = false;
        equalClicked = false;
      } else if (equalClicked) {                                                              // Don't allow to enter a new number after '=' has been performed
        reset();
        resetClicked = false;
      };

      result.textContent += number;

      numericValue = parseFloat(displayMaxNumberLength()); 
      result.textContent = displayMaxNumberLength(); 
      
      result.textContent = formatNumberWithSpaces();
      numericValue = parseFloat(result.textContent.replace(/\s/g, ""));                       // Remove whitespace before parsing, and retain the whole value

      numericValue = numericValue.toFixed(result.textContent.split(".")[1]?.length || 0);     // Makes sure it doesn't delete more than one non 0 number (or 0 numbers) after a sequence of 0s entered
    });
  });
};
displayNumbers();

// Display a number of max to 9 digits (not including decimal numbers)
function displayMaxNumberLength() {
  let numDisplay = result.textContent.replace(/\s+/g, "");                                    // Remove any unnecessary whitespace
  let numParts = numDisplay.split(".");                                                       // Separate a number into numbers 'before' and 'after' a decimal (if there are any)
 
  let maxDigits = 9;

  if (numParts[0].length > maxDigits) {                                                       // If the length of the integer is greater than 9 digits
    numParts[0] = numParts[0].substring(0, maxDigits);                                        // Truncate the integer length to 9 digits max
  };

  if (numParts.length > 1) {                                                                  // If the decimal part of the number is present
    // For example if maxDigits is 9 and integer part has 6 digits...
    // Max length for decimal digits is 3 (Ex: 234164.535)
    let maxDecimalDigits = maxDigits - numParts[0].length;                                    // Subtract length of the integer from maximum digits allowed 

    if (numParts[1].length > maxDecimalDigits) {                                              // If length of decimal digits greater than max decimal digits allowed
      numParts[1] = numParts[1].substring(0, maxDecimalDigits);                               // Truncate the decimal part to max allowed length
    };
    numDisplay = numParts[0] + "." + numParts[1];                                             // Concatenate 2 parts together if decimal has been entered
  } else {
    numDisplay = numParts[0];
  };

  return numDisplay;
};

// Space out numbers for every 3 digits for better readability
function formatNumberWithSpaces() {
  let spacedOutput = result.textContent;

  let parts = spacedOutput.split(".");                                                        // Split a value into numbers before and after the decimal
  let integers = parts[0];
  let decimals = parts[1];

  if (decimals) {                                                                             // If number after decimal has been entered
    decimals = decimals.replace(/\s/g, "");                                                   // Remove any whitespace from numbers after the decimal
    integers = integers.replace(/(\d)(?=(\d{3})+(?!\d|e[\+\-]))/g, "$1 ");                    // ... but keep numbers spaced out 3 digits before the decimal
    spacedOutput = integers + "." + decimals;
  } else {
    spacedOutput = spacedOutput.replace(/(\d)(?=(\d{3})+(?!\d|e[\+\-]))/g, "$1 ");
  };
  
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
        scientificResult = intNum.toFixed(2).replace(/\.?0+$/, '');                                             // Removes any trailing 0s and rounds it to 2 decimal place
      };
    } else {                                                                                                    // Case for negative integers
      if (Math.abs(intNum) >= 1e+9) {
        scientificResult = Number.parseFloat(intNum).toExponential(5).replace(/(\.?0+)?e/, "e");
      } else {
        scientificResult = intNum.toFixed(2).replace(/\.?0+$/, '');
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
  // Also prevents display overflow if the exponent of scientific notation is greater than 20, and vice versa
};

// Format decimal numbers, excluding scientific notation
function formatDecimals(scientificResult) {
  if (scientificResult.includes(".") && !scientificResult.includes("e")) {
    const decimalNum = parseFloat(scientificResult);
    const absoluteNum = Math.abs(decimalNum);                                                                   // Make decimal numbers as absolute numbers     

    if (absoluteNum >= 1e+9) {
      scientificResult = decimalNum.toExponential(5).replace(/(\.?0+)?e/, "e");
    } else if (absoluteNum >= 1) {                                                                              // If greater or equal to 1, round to 2 decimals
      scientificResult = decimalNum.toFixed(2).replace(/\.?0+$/, "");
    } else if (absoluteNum >= 0.00001 && absoluteNum < 1) {                                                     // If between 0.00001 and 0.99999 (+/-), round to 5 decimals
      scientificResult = decimalNum.toFixed(5).replace(/\.?0+$/, "");                       
    } else {                                                                                                    // if less than 0.00001, convert to scientific notation
      scientificResult = decimalNum.toExponential(5).replace(/(\.?0+)?e/, "e");
    };
  };
  return scientificResult;
};

// Format the 'expression' display with spaces
function formatExpressionWithSpaces(numInput) {
  let spacedOutput = numInput;
  spacedOutput = spacedOutput.replace(/(\d)(?=(\d{3})+(?!\d|e[\+\-]))/g, "$1 ");              // Separate every 3 digits, excluding scientific notation

  if (spacedOutput.startsWith("0.") || spacedOutput.startsWith("-0.")) {                      // Remove any whitespace from numbers starting with 0. or -0.
    spacedOutput = spacedOutput.replace(/\s/g, "");
  };
  
  return spacedOutput;
}

// Format the 'expression' display if there any decimal numbers, scientific notation, etc
function formatExpression(num) {
  let formattedNumber = num.toString();
  formattedNumber = formatIntegers(formattedNumber);
  formattedNumber = formatScientificNotation(formattedNumber);
  formattedNumber = formatDecimals(formattedNumber);

  return formattedNumber;
};

// Format numbers
function formatNumbers() {
  let scientificResult = result.textContent.replace(/\s/g, "");                               // Make sure there isn't any unpredictable white space before formatting

  if ((previousOperator !== null && operator !== null) || previousOperator === null) {
    scientificResult = formatIntegers(scientificResult);
    scientificResult = formatScientificNotation(scientificResult);
    scientificResult = formatDecimals(scientificResult);
  };
         
  if (equalClicked) {                                                                         // Rules if "=" sign has been clicked
    result.textContent = scientificResult; 
    const formattedInitialFirstNum = formatExpression(initialFirstNum);
    const formattedInitialSecondNum = formatExpression(secondNum);
    expression.textContent = `${formatExpressionWithSpaces(formattedInitialFirstNum)} ${operator} 
                              ${formatExpressionWithSpaces(formattedInitialSecondNum)} = `;      
  } else {
    result.textContent = scientificResult;
    expression.textContent = `${scientificResult} ${operator}`;
  };

  numberFormat = true;

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
    case "÷":
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
  
  if (backspaceClicked) {
    backspaceClicked = false;
  };

  // Detect if there was division by 0
  if ((previousOperator === "÷" && operator !== null) && secondNum === 0) {
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

// Reset everything after reset button is clicked
function resetCalculator() {
  clearAll.addEventListener("click", () => {
    reset();
    result.textContent = "0";
  });
};
resetCalculator();

// Detect if reset button was clicked
function resetIsClicked() {
  if (resetClicked) {                                                                         // If 'AC' clicked and no new number was entered, keep it in 'default' state                                
    reset();
    result.textContent = "0";  
    return true;
  };
  return false;
};

// Store the currently and previously clicked operators 
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
    "÷": {
      clicked: divideClicked,
      check: addClicked || subtractClicked || multiplyClicked,
    },
  };
};

// Update expression display in appropriate format if there any decimal numbers or scientific notation ("=" excluded)
function updateExpressionFormat(operator) {
  if (numberFormat && !equalClicked) {                                                                         
    expression.textContent = `${formatNumbers()} ${operator}`;
  } else {
    numberFormat = false;
    expression.textContent = `${firstNum} ${operator}`;
    if (!numberClicked && previousOperator === null) {                                        // If no number was clicked and previous operator not yet defined, then return nothing
      expression.textContent = "";
      result.textContent = "0";
      return;
    };
  };
};

// Handler for when operators are clicked in the calculator 
function handleOperators(mathOperator) {

  operator = mathOperator;

  const operatorFlags = getOperatorFlags();

  // After any operator is clicked, convert a number to a number type to avoid string concatenation after addition or other unexpected behavior
  if (hasDecimal(numericValue)) {
    numericValue = parseFloat(numericValue);
  } else {
    numericValue = parseFloat(numericValue);
  };
  
  // Make sure expression display doesn't display anything when no number was entered and operator clicked
  if (!numberClicked && !percentageClicked && !resetClicked && !backspaceClicked && previousOperator === null) {
    return;
  };

  if (backspaceClicked && previousOperator === "/" && numericValue === 0) {
    reset();
    resetClicked = false;
    result.textContent = "ERROR";
    expression.textContent = "";
    backspaceClicked = false;
    displayError = true;
    return;
  };

  // If 'AC' clicked, reset calculator
  if (resetIsClicked()) return;                                                                 

  // Return nothing when operator is clicked right after % without any entered number
  if (percentageClicked && !numberClicked && previousResult === null) {
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
  numberClicked = false;

  // If operator clicked right after backspace, and no number was entered before that, return nothing
  if (backspaceClicked && numericValue === 0) {
    expression.textContent = "";
    return;
  };

  // Boolean clicked value is based on operator selected, and sets other remaining booleans to false
  addClicked = operator === "+";                                                   
  subtractClicked = operator === "-";
  multiplyClicked = operator === "x";
  divideClicked = operator === "÷";

  // Handle '%' functionality accurately when operator is clicked after '%'
  if (percentageClicked) {
    expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
    percentageClicked = false;
  } else {
    // Allows to perform calculations from where is was left of, after "=" was clicked
    if (equalClicked) {                                                                       // If operator was clicked after the "="
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
      equalClicked = false;
    } else {
      calculateNumbers();
      expression.textContent = `${formatNumberWithSpaces()} ${operator}`;
    };
  };

  // Display "ERROR" when divided by '0'
  if (displayDivisionError()) return;                                             

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
    handleOperators("÷");
  });
};

// Convert a number into percentage value when '%' is clicked
function getPercentageValue() {
  percentage.addEventListener("click", () => {

     // If division by 0 is in progress and '%' clicked, display "ERROR" and reset the calculator
     if (numberClicked && (operator === "÷" && numericValue === 0)) {
      reset();
      resetClicked = false;
      result.textContent = "ERROR";
      expression.textContent = "";
      displayError = true;
      return;
    };

    // After '%' convert a number to a number type to avoid string concatenation after addition or "NaN" in display
    if (hasDecimal(numericValue)) {
      numericValue = parseFloat(numericValue);
    } else {
      numericValue = parseFloat(numericValue);
    };

    if (displayDivisionError()) return;

    // If 'reset' was clicked before '%' return nothing
    if (resetIsClicked()) return;

    if (firstNum === null) {
      firstNum = numericValue / 100;                                                       
      result.textContent = firstNum;
      expression.textContent = `${formatNumberWithSpaces()}`;
      percentageClicked = true;
    } else {                        
      secondNum = numericValue;               
      if (previousResult === null) {
        if (!operatorClicked) {                                                               // Case for when '%' multiple times without any operators   
          firstNum = firstNum / 100;
          result.textContent = firstNum;
          formatNumbers(); 
          expression.textContent = `${result.textContent}`;
        } else if (operatorClicked && numberClicked) {                                        // Case when operator is registered, but the full result not known yet before clicking the '%'
          firstNum = operate(operator, firstNum, secondNum) / 100;                            // Perform calculation between first and second numbers and / 100 when '%' clicked
          result.textContent = firstNum;
          previousResult = firstNum;
          formatNumbers();
          expression.textContent = `${result.textContent}`;
          percentageClicked = true; 
          return;
        } else {
          firstNum = firstNum / 100;
          result.textContent = firstNum;
          percentageClicked = true;
          formatNumbers();
          expression.textContent = `${formatNumberWithSpaces()}`;
          return;
        };     
      } else {
        previousResult = previousResult / 100;              
        firstNum = previousResult;
        result.textContent = previousResult;
        expression.textContent = `${result.textContent}`;
        formatNumbers();
        expression.textContent = `${formatNumberWithSpaces()}`;
        percentageClicked = true;

        // Reset every time new '%' is clicked if previousResult is known
        addClicked = false;
        subtractClicked = false;
        multiplyClicked = false;
        previousOperator = null;
        divideClicked = false
        numberClicked = false;
        operatorClicked = false;
        resetClicked = false;
        equalClicked = false;
        return;  
      };
    };

    if (equalClicked) {
      percentageClicked = true;
      equalClicked = false;
    };

    // Case if number was clicked before '%' 
    if (numberClicked && !displayError) {
      formatNumbers();
      expression.textContent = `${formatNumberWithSpaces()}`;
    } else if (numberClicked && displayError) {
      expression.textContent = "";
    } else if (!numberClicked) {
      expression.textContent = "";
    };
  });
};

// 'Backspace' function that removes last digit every time its clicked
function deleteDigit() {
  backspace.addEventListener("click", () => {

    if (displayDivisionError()) return;

    if (firstNum !== null && !numberClicked) return;
    if (percentageClicked) return;
    if (equalClicked) return;

    let digits = numericValue.toString().split("");                                           // Turn the current value into a string, then array
    digits.pop();                                                                             // Remove the last digit every time backspace button is clicked

    if (previousResult !== null && !numberClicked) {                                          // If prevResult is known, but no new number detected before hitting backspace, then keep original value
      numberClicked = false;
      return;
    } else if (((previousResult !== null || previousResult === null) && numberClicked) || firstNum !== null) {                  
      if (digits.length === 0) {
        numericValue = digits.join("");
        numericValue = 0;                                                                     // Set value to 0 if max digits have been deleted
      } else {
        numericValue = digits.join("");                                                        
      };
    };
    
    numberClicked = true;
    result.textContent = numericValue;
    backspaceClicked = true;

    formatNumberWithSpaces();

    if (resetIsClicked()) return;
  });
};

let initialFirstNum = null;

// Calculate the numbers when '=' is clicked
function equalsIsClicked() {
  equal.addEventListener("click", () => { 

    // After '=' convert a number to a number type to avoid string concatenation after addition
    if (hasDecimal(numericValue)) {
      numericValue = parseFloat(numericValue);
    } else {
      numericValue = parseInt(numericValue);
    };

    initialFirstNum = firstNum;                                                               // Set firstNum to a new variable before it was modified by calculation
                                                                                              // (Needed in order to make expression.textContent to work properly)
    // If no operator was clicked before "=", return nothing
    if (!operatorClicked) return;

    if (backspaceClicked) {
      backspaceClicked = false;
    };

    // If no number was clicked after operator
    if (!numberClicked) return;

    if (percentageClicked) {
      if (firstNum !== null) {
        return;
      };
    };
  
    // Perform calculations when "=" is clicked
    if (firstNum !== null) {
      equalClicked = true;
      calculateNumbers();                                                                     // Calculate numbers when '=' is clicked
      operator = null;
      previousOperator = null;
      operatorClicked = null;
      secondNum = null;
      previousResult = null;
    };
  
    if (displayDivisionError()) return;                                              
  });
};

// Check if the number has a decimal
function hasDecimal(num) {
  return num % 1 !== 0;
};

// Turn number into a decimal number if the button is clicked
function decimalIsClicked() {
  decimal.addEventListener("click", () => {

    // Allow to enter a decimal after reset was performed without clicking 0
    if (resetIsClicked()) {
      numericValue = 0;
    };

    let decimalPoint = "."; 

    if (displayDivisionError()) return;

    if (operatorClicked) {
      if (!numberClicked) {
        return;
      };
    };

    if (percentageClicked) return;
    if (equalClicked) return;

    // Perform implementation of decimal '.' when clicked
    if (hasDecimal(numericValue)) {                                                           // If the number entered has a decimal, then do nothing
      return;
    } else {                                                                                  // If the number does not have a decimal, include one, if the button is clicked
      let decimalValue = numericValue.toString().split("");
      decimalValue.push(decimalPoint);                      
      decimalValue = decimalValue.join("");
      result.textContent = decimalValue;
      numericValue = parseFloat(decimalValue);
      formatNumberWithSpaces();
    };
  });
};

// Handle keyboard support for operators 
function keyPressHandler(e) {
  // Retrieve the value of the key that is being pressed
  let keyPress = e.key;                                                                      

  if (keyPress === "+") {
    handleOperators("+");
  } else if (keyPress === "-") {
    handleOperators("-");
  } else if (keyPress === "*") {
    handleOperators("x");
  } else if (keyPress === "/") {
    handleOperators("÷");
  };

  // Suppresses any default browser behavior associated with the keys 
  // ... and only used to trigger handleOperators function
  e.preventDefault();                                                                         
};

document.addEventListener("keydown", keyPressHandler);

// Create a mode switch for light and night modes
function switchMode() {
  const modeSwitch = document.querySelector("#modeSwitch");
  const calculatorContainer = document.querySelector(".calculator-container");
  const outputContainer = document.querySelector(".output-container");
  const buttonStyle = document.querySelectorAll(".button");
  const svgButton = document.querySelector("svg");
  const resultStyle = document.querySelector(".result");
  const expressionStyle = document.querySelector(".expression");

  modeSwitch.addEventListener("change", () => {
    if (modeSwitch.checked) {
      calculatorContainer.classList.add("dark-mode")
      outputContainer.classList.add("dark-mode");
      buttonStyle.forEach(button => button.classList.add("dark-mode"));
      svgButton.classList.add("dark-mode");
      resultStyle.classList.add("dark-mode");
      expressionStyle.classList.add("dark-mode");
    } else {
      calculatorContainer.classList.remove("dark-mode");
      outputContainer.classList.remove("dark-mode");
      buttonStyle.forEach(button => button.classList.remove("dark-mode"));
      svgButton.classList.remove("dark-mode");
      resultStyle.classList.remove("dark-mode");
      expressionStyle.classList.remove("dark-mode");
    };
  });
};
switchMode();


decimalIsClicked();
deleteDigit();
getPercentageValue();
addNumbers();
subtractNumbers();
multiplyNumbers();
divideNumbers();
equalsIsClicked();
