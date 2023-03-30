// Calculator by Vlad Hadyak

const result = document.querySelector(".result");
const expression = document.querySelector(".expression");

const divide = document.querySelector("#division");
const multiply = document.querySelector("#multiplication");
const subtract = document.querySelector("#subtraction");
const add = document.querySelector("#addition");
const equal = document.querySelector("#equals");

const numButtons = [];

let numericValue = 0;
let runningTotal = 0;
let operator = "";

let addClicked = false;
let subtractClicked = false;
let equalClicked = false;
let numberClicked = false;

// Include 10 number buttons
for (let i = 0; i <= 9; i++) {
  numButtons[i] = document.querySelector("#num" + i);
}; 

function displayNumbers() {
  numButtons.forEach((button) => {
    const number = button.textContent;
    button.addEventListener("click", () => {
 
      if (addClicked) {                                   // If add button was clicked before entering second number
        result.textContent = "";
        addClicked = true;
      } else if (subtractClicked) {
        result.textContent = "";
        subtractClicked = true;
      };

      let finalNumber = result.textContent += number;
      // If numbers exceed over 15 digits in length on display, then restrict it from displaying more numbers
      if (finalNumber.toString().length > 15) {                      
         finalNumber = finalNumber.substring(0, 15);
      };
      result.textContent = finalNumber;                  // finalNumber means if you are done with entering anymore digits and ready to use operators
      numericValue = parseFloat(finalNumber);            // Converts 'string' value to 'numeric' value

      // Split each number button selected and convert into an array of numbers
      const digits = numericValue.toString().split("");  
      const numArr = digits.map((digit) => {
        return parseFloat(digit);
      })
      console.log(numArr);
    });   
  });
};
displayNumbers();



function addExpression(operator) {
  if (operator == "+") {
    expression.textContent += `${numericValue} ${operator}`;
  } else if (operator == "-") {
    expression.textContent += `${numericValue} ${operator}`;
  };
  return operator;
};


function addition() {
  add.addEventListener("click", () => {

  });
};
addition();


function subtraction() {
  subtract.addEventListener("click", () => {

  });
};
subtraction();




