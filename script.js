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

// Include 10 number buttons
const numButtons = [];

for (let i = 0; i <= 9; i++) {
  numButtons[i] = document.querySelector("#num" + i);
}; 

// Express numbers in scientific notation if it's too big
function createScientificNotation() {
  let scientificResult = result.textContent;
  scientificNotation = true;

  if (previousOperator !== null && (operator !== null)) {
    if (scientificResult.length > 12) {
      scientificResult = Number.parseFloat(scientificResult).toExponential(5);
      result.textContent = scientificResult;
      expression.textContent = ` ${scientificResult} ${operator}`;;
    };
  };
  return scientificResult;
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
      } else if (multiplyClicked) {
        result.textContent = "";
        multiplyClicked = false;
      } else if (divideClicked) {
        result.textContent = "";
        divideClicked = false;
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
    case "x":
      return firstNum * secondNum;
    case "/":
      return firstNum / secondNum;
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
};

const addNumbers = function() {
  add.addEventListener("click", () => {

    if (addClicked && previousOperator !== "+") {                                             // If 'add' clicked, then 'subtract', and then 'add' again, then perform addition 
      previousOperator = "+";
    };

    operator = "+";

    if (operatorClicked && addClicked) {                                                      // If operator was clicked ("+"), and clicked again ("+") right after
      if (firstNum !== null || secondNum !== null) {                                          // If first and second numbers are not empty
        return;                                                                               // Return nothing, unless same operator is clicked and number entered, return that operation result
      };
    } else if (subtractClicked || multiplyClicked || divideClicked) {                         // If 'subtract' was clicked or 'multiply', then 'add' was clicked, then return addition
      previousOperator = "+";
      if (scientificNotation) {
        expression.textContent = `${createScientificNotation()} ${operator}`;
      } else {
        expression.textContent = `${previousResult} ${operator}`;
      };
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

    if (subtractClicked && previousOperator !== "-") {                                        // If 'subtract' was clicked, then 'add', and then 'subtract' again, then perform subtraction 
      previousOperator = "-";
    };
    
    operator = "-";

    expression.textContent = `${firstNum} ${operator}`;
   
    if (operatorClicked && subtractClicked) {
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked || multiplyClicked || divideClicked) {
      previousOperator = "-";
      if (scientificNotation) {
        expression.textContent = `${createScientificNotation()} ${operator}`;
      } else {
        expression.textContent = `${previousResult} ${operator}`;
      };
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

    if (multiplyClicked && previousOperator !== "x") {                                      
      previousOperator = "x";
    };

    operator = "x";

    expression.textContent = `${firstNum} ${operator}`;
    
    if (operatorClicked && multiplyClicked) {
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked || subtractClicked || divideClicked) {
      previousOperator = "x";
      if (scientificNotation) {
        expression.textContent = `${createScientificNotation()} ${operator}`;
      } else {
        expression.textContent = `${previousResult} ${operator}`;
      };
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

    if (divideClicked && previousOperator !== "/") {                                      
      previousOperator = "/";
    };

    operator = "/";

    expression.textContent = `${firstNum} ${operator}`;

    if (operatorClicked && divideClicked) {
      if (firstNum !== null || secondNum !== null) {
        return;
      };
    } else if (addClicked || subtractClicked || multiplyClicked) {
      previousOperator = "/";
      if (scientificNotation) {
        expression.textContent = `${createScientificNotation()} ${operator}`;
      } else {
        expression.textContent = `${previousResult} ${operator}`;
      };
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
