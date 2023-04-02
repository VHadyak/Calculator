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

    operatorClicked = true;
    addClicked = true;
    subtractClicked = false;
    operator = "+";
    
    
    if (firstNum === null) {                                                                  // If previous calculations haven't been performed, then assign numericValue to firstNum
      firstNum = numericValue;
      expression.textContent = `${firstNum} ${operator} `;
      result.textContent = firstNum;
    } else {                                                                                  // If firstNum has a value
      secondNum = numericValue;                                                               // Assign numericValue to secondNum 
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
    operatorClicked = true;
    subtractClicked = true;
    addClicked = false;
    operator = "-";
    
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

calculate();
