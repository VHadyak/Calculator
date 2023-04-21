// Calculator by Vlad Hadyak

// Output variables
const result = document.querySelector(".result");
const expression = document.querySelector(".expression");

// Operation variables
const add = document.querySelector("#addition");
const subtract = document.querySelector("#subtraction");
const divide = document.querySelector("#division");
const multiply = document.querySelector("#multiplication");
const equal = document.querySelector("#equals");

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

let scientificNotation = false;
let displayError = false;

// Include 10 number buttons
const numButtons = [];

for (let i = 0; i <= 9; i++) {
  numButtons[i] = document.querySelector("#num" + i);
}; 

// Space out the numbers for better readability
//function createSpacedNumbers() {
  
//};

// Express numbers in scientific notation if the output of the number is too big or too small
function createScientificNotation() {
  let scientificResult = result.textContent;
  
  if (previousOperator !== null && operator !== null) {

    if (!scientificResult.includes(".") && !scientificResult.includes("e")) {
      scientificResult = parseInt(scientificResult).toFixed(1).replace(/\.?0+$/, '');
      if (scientificResult >= 0 && scientificResult > 999999999999) {
        scientificResult = Number.parseFloat(scientificResult).toExponential(5);  
      } else if (scientificResult >= 0 && scientificResult <= 999999999999) {
        if (scientificResult.includes("e")) {
          scientificResult = parseInt(scientificResult).toFixed(1).replace(/\.?0+$/, '');
        };
      } else if (scientificResult < 0 && scientificResult < -999999999999) {
        scientificResult = Number.parseFloat(scientificResult).toExponential(5);
      } else if (scientificResult < 0 && scientificResult >= -999999999999) {
        scientificResult = parseInt(scientificResult).toFixed(1).replace(/\.?0+$/, '');
      };  

    } else if (scientificResult.includes("e")) {
      let exponent = parseInt(scientificResult.split("e")[1]);
      if (exponent > 20) {
        scientificResult = Number.parseFloat(scientificResult).toExponential(5);
      } else if (exponent < 0) {                                   
        scientificResult = Number.parseFloat(scientificResult).toExponential(5);
      };

    } else if (scientificResult.includes(".") && !scientificResult.includes("e")) {
      if (parseFloat(scientificResult) >= 1 && parseFloat(scientificResult) > 999999999999) {
        scientificResult = Number.parseFloat(scientificResult).toExponential(5);
      } else if (parseFloat(scientificResult) >= 1 && parseFloat(scientificResult) <= 999999999999) {
        scientificResult = parseFloat(scientificResult).toFixed(1).replace(/\.?0+$/, '');
      } else if (parseFloat(scientificResult) > 0 && parseFloat(scientificResult) < 1) {

        if (parseFloat(scientificResult) < 0.00001) {
          scientificResult = parseFloat(scientificResult).toExponential(5);
        } else {
          scientificResult = parseFloat(scientificResult).toFixed(5).replace(/\.?0+$/, '');
        };

      } else if (parseFloat(scientificResult) < 0 && parseFloat(scientificResult) > -1) {
        if (parseFloat(scientificResult) > -0.00001) {
          scientificResult = parseFloat(scientificResult).toExponential(5);
        } else {
          scientificResult = parseFloat(scientificResult).toFixed(5).replace(/\.?0+$/, '');
        };

      } else if (parseFloat(scientificResult) <= -1 && parseFloat(scientificResult) < -999999999999) {
        scientificResult = Number.parseFloat(scientificResult).toExponential(5);
      } else if (parseFloat(scientificResult) <= -1 && parseFloat(scientificResult) >= -999999999999) {
        scientificResult = parseFloat(scientificResult).toFixed(1).replace(/\.?0+$/, '');
      };
    };
  };
  
  scientificNotation = true;
  result.textContent = scientificResult;
  expression.textContent = ` ${scientificResult} ${operator}`;
  
  return scientificResult;
};

// Reset calculator
function resetCalculator() {
  result.textContent = "0";
  expression.textContent = "";
  firstNum = null;
  secondNum = null;
  operator = null;
  previousOperator = null;
  previousResult = null;
  operatorClicked = false;
  addClicked = false;
  subtractClicked = false;
  multiplyClicked = false;
  divideClicked = false;
  scientificNotation = false;
  displayError = false;
};


// Display numbers 
function displayNumbers() {
  numButtons.forEach((button) => {
    const number = button.textContent;
    button.addEventListener("click", () => {

      if (displayError) {
        resetCalculator();
        console.log("RESET CALCULATOR");
        result.textContent = "";
        displayError = false;
      };

      numberClicked = true;

      // Clear 'result' container every-time a new number is clicked after operator 
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
      };
      
      result.textContent += number;
      numericValue = parseFloat(result.textContent);
      //createSpacedNumbers();   
    });
  });
};
displayNumbers();

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
      if (secondNum === 0) {
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
    createScientificNotation();
  };

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

const addNumbers = function() {
  add.addEventListener("click", () => {

    if (displayError) {
      resetCalculator();
      console.log("RESET CALCULATOR2");
      expression.textContent = "";
      result.textContent = "0";
      displayError = true;
      return;
    } else {
      displayError = false;
    };

    if (addClicked && previousOperator !== "+") {                                             // If 'add' clicked, then 'other operator' was clicked, and then 'add' again, then perform addition 
      previousOperator = "+";
    };

    operator = "+";

    if (scientificNotation) {                                                           
      expression.textContent = `${createScientificNotation()} ${operator}`;
    } else {
      scientificNotation = false;
      expression.textContent = `${firstNum} ${operator}`;
    };

    if (operatorClicked && addClicked) {                                                      // If operator was clicked ("+"), and clicked again ("+") right after
      if (firstNum !== null || secondNum !== null) {                                          // If first and second numbers are not empty
        return;                                                                               // Return nothing, unless same operator is clicked and number entered, return that operation result
      };
    } else if (subtractClicked || multiplyClicked || divideClicked) {                         // If 'subtract' was clicked or 'multiply' or 'divide', then 'add' was clicked, then return addition
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

    previousOperator = "+";                                                                   // previousOperator behaves as current operator 
  });
};

const subtractNumbers = function() {
  subtract.addEventListener("click", () => {

    if (displayError) {
      resetCalculator();
      console.log("RESET CALCULATOR2");
      expression.textContent = "";
      result.textContent = "0";
      displayError = true;
      return;
    } else {
      displayError = false;
    };

    if (subtractClicked && previousOperator !== "-") {                                       
      previousOperator = "-";
    };

    operator = "-";
   
    if (scientificNotation) {                                                           
      expression.textContent = `${createScientificNotation()} ${operator}`;
    } else {
      scientificNotation = false;
      expression.textContent = `${firstNum} ${operator}`;
    };
   
    if (operatorClicked && subtractClicked) {
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked || multiplyClicked || divideClicked) {
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
    previousOperator = "-";
  });
};


const multiplyNumbers = function() {
  multiply.addEventListener("click", () => {

    if (displayError) {
      resetCalculator();
      console.log("RESET CALCULATOR2");
      expression.textContent = "";
      result.textContent = "0";
      displayError = true;
      return;
    } else {
      displayError = false;
    };

    if (multiplyClicked && previousOperator !== "x") {                                      
      previousOperator = "x";
    };

    operator = "x";

    if (scientificNotation) {                                                           
      expression.textContent = `${createScientificNotation()} ${operator}`;
    } else {
      scientificNotation = false;
      expression.textContent = `${firstNum} ${operator}`;
    };
    
    if (operatorClicked && multiplyClicked) {
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked || subtractClicked || divideClicked) {
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

    previousOperator = "x";
  });
};

const divideNumbers = function() {
  divide.addEventListener("click", () => {

    if (displayError) {
      resetCalculator();
      console.log("RESET CALCULATOR2");
      expression.textContent = "";
      result.textContent = "0";
      displayError = true;
      return;
    } else {
      displayError = false;
    };

    if (divideClicked && previousOperator !== "/") {                                      
      previousOperator = "/";
    };

    operator = "/";

     if (scientificNotation) {                                                           
      expression.textContent = `${createScientificNotation()} ${operator}`;
    } else {
      scientificNotation = false;
      expression.textContent = `${firstNum} ${operator}`;
    };

    if (operatorClicked && divideClicked) {
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked || subtractClicked || multiplyClicked) {
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
