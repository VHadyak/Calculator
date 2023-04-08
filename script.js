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
let equalClicked = false;
let numberClicked = false;
let operatorClicked = false;

// Include 10 number buttons
const numButtons = [];

for (let i = 0; i <= 9; i++) {
  numButtons[i] = document.querySelector("#num" + i);
}; 

// Display numbers 
function displayNumbers() {
  numButtons.forEach((button) => {
    const number = button.textContent;
    button.addEventListener("click", () => {
      numberClicked = true;

      // Clear 'result' container every-time a new number is clicked after operator 
      if (addClicked) {                                     
        result.textContent = "";
        addClicked = false;
      } else if (subtractClicked) {
        result.textContent = "";
        subtractClicked = false;
      };

      result.textContent += number;     
      numericValue = parseFloat(result.textContent);
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
    case "*":
      return firstNum * secondNum;
    case "/":
      return firstNum / secondNum;
    default:
      return null;
  };
};

const addNumbers = function() {
  add.addEventListener("click", () => {

    if (addClicked && previousOperator === "-") {                                             // If 'add' clicked, then 'subtract', and then 'add' again, then perform addition 
      previousOperator = "+";
    };

    operator = "+";

    expression.textContent = `${firstNum} ${operator}`;

    if (operatorClicked && addClicked) {                                                      // If operator was clicked ("+"), and clicked again ("+") right after
      if (firstNum !== null || secondNum !== null) {                                          // If first and second numbers are not empty
        return;                                                                               // Return nothing, unless same operator is clicked and number entered, return that operation result
      };
    } else if (subtractClicked) {                                                             // If 'subtract' was clicked, then 'add' was clicked, then return addition
      previousOperator = "+";
      expression.textContent = `${previousResult} ${operator}`;
      if (firstNum !== null || secondNum !== null) {
        if (!previousResult) {
          expression.textContent = `${firstNum} ${operator}`;
        };
        return;
      };
    };

    operatorClicked = true;
    subtractClicked = false;
    addClicked = true;
    
    if (firstNum === null) {                                                                  // If previous calculations haven't been performed, then assign numericValue to firstNum
      firstNum = numericValue;
      expression.textContent = `${firstNum} ${operator} `;
      result.textContent = firstNum;
    } else {                                                                                  // If firstNum has a value
      secondNum = numericValue;                                                               // Assign numericValue to secondNum after operator was clicked
      if (previousResult === null) {                                                          // If previousResult does not exist
        previousResult = firstNum;                                                            // Assign the value of firstNum as previousResult
      } else {                                                                                // If previousResult has a value
        firstNum = operate(operator, firstNum, secondNum);                                    // Perform calculation of the previous firstNum and new secondNum value
        result.textContent = firstNum;
      };
      firstNum = operate(previousOperator || operator, previousResult, secondNum);            // Perform calculation using previousOperator and previousResult, and new secondNum
      previousResult = firstNum;                                                              // Update previousResult after operation
      expression.textContent = `${previousResult} ${operator} `;
      result.textContent = previousResult;
    };
    previousOperator = "+";                                                                   // previousOperator behaves as current operator 
  });
};

const subtractNumbers = function() {
  subtract.addEventListener("click", () => {

    if (subtractClicked && previousOperator === "+") {                                        // If 'subtract' was clicked, then 'add', and then 'subtract' again, then perform subtraction 
      previousOperator = "-";
    };
    
    operator = "-";

    expression.textContent = `${firstNum} ${operator}`;
   
    if (operatorClicked && subtractClicked) {
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked) {
      previousOperator = "-";
      expression.textContent = `${previousResult} ${operator}`;
      if (firstNum !== null || secondNum !== null) {
        if (!previousResult) {
          expression.textContent = `${firstNum} ${operator}`;
        };
        return;
      };
    };
 
    operatorClicked = true;
    addClicked = false;
    subtractClicked = true;
    
    if (firstNum === null) {   
      firstNum = numericValue;
      expression.textContent = `${firstNum} ${operator} `;
      result.textContent = firstNum;
    } else {                                                             
      secondNum = numericValue;
      if (previousResult === null) {
        previousResult = firstNum;
      } else {
        firstNum = operate(operator, firstNum, secondNum);
        result.textContent = firstNum;
      };
      firstNum = operate(previousOperator || operator, previousResult, secondNum);
      previousResult = firstNum;
      expression.textContent = `${previousResult} ${operator}`;
      result.textContent = previousResult;
    };
    previousOperator = "-";
  });
};

addNumbers();
subtractNumbers();
